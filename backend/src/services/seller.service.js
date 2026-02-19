const userRepo = require("../repositories/user.repository");
const sellerRepo = require("../repositories/seller.repository");
const productRepo = require("../repositories/product.repository");
const mongoose = require("mongoose");

class SellerService {
  formatPublicSellerProfile(seller) {
    return {
      _id: seller._id,
      userId: seller.userId?._id || seller.userId,
      fullName: seller.userId
        ? `${seller.userId.firstName || ""} ${seller.userId.lastName || ""}`.trim()
        : "",
      firstName: seller.userId?.firstName,
      lastName: seller.userId?.lastName,
      email: seller.userId?.email,
      description: seller.description,
      profileUrl: seller.profileUrl,
      bannerUrl: seller.bannerUrl,
      address: seller.address,
      isVerified: seller.isVerified,
      rating: seller.rating,
      totalSales: seller.totalSales,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    };
  }

  /**
   * Switch a user to seller role and create seller profile
   * @param {string} userId - The user's ID
   * @param {Object} sellerData - Seller profile data
   * @returns {Object} Created seller profile
   */
  async switchToSeller(userId, sellerData) {
    const { description, address, bankAccount } = sellerData;
    if (!description || !address || !bankAccount) {
      const error = new Error("Description, address and bank account are required");
      error.statusCode = 400;
      throw error;
    }

    // 1. Check if user exists
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 2. Check if user is already a seller
    if (user.role.includes("seller")) {
      throw new Error("User is already a seller");
    }

    // 3. Check if seller profile already exists
    const existingSeller = await sellerRepo.findByUserId(userId);
    if (existingSeller) {
      throw new Error("Seller profile already exists for this user");
    }

    // 4. Update user role to include 'seller'
    user.role.push("seller");
    await user.save();

    // 5. Create seller profile (if it fails, rollback user role update)
    try {
      const sellerProfile = await sellerRepo.createSellerProfile({
        userId,
        description,
        address,
        bankAccount,
      });

      const populatedProfile = await sellerRepo.findByIdWithUser(sellerProfile._id);
      return populatedProfile || sellerProfile;
    } catch (error) {
      user.role = user.role.filter((role) => role !== "seller");
      await user.save();
      throw error;
    }
  }

  /**
   * Get seller profile by userId
   * @param {string} userId - The user's ID
   * @returns {Object} Seller profile
   */
  async getSellerProfile(userId) {
    const seller = await sellerRepo.findByUserIdWithUser(userId);
    
    if (!seller) {
      throw new Error("Seller profile not found");
    }

    return seller;
  }

  /**
   * Check if user is already a seller
   * @param {string} userId - The user's ID
   * @returns {boolean}
   */
  async isUserSeller(userId) {
    const user = await userRepo.findById(userId);
    return user && user.role.includes("seller");
  }

  async getVisibleSellers() {
    const sellers = await sellerRepo.findAllWithUser();
    return sellers.map((seller) => this.formatPublicSellerProfile(seller));
  }

  async getSellerPublicProfile(sellerId) {
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      const error = new Error("Invalid seller id");
      error.statusCode = 400;
      throw error;
    }

    const seller = await sellerRepo.findByIdWithUser(sellerId);
    if (!seller) {
      const error = new Error("Seller profile not found");
      error.statusCode = 404;
      throw error;
    }

    return this.formatPublicSellerProfile(seller);
  }

  async getSellerPublicProducts(sellerId, type = "remaining") {
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      const error = new Error("Invalid seller id");
      error.statusCode = 400;
      throw error;
    }

    if (type !== "remaining" && type !== "sold") {
      const error = new Error("Invalid type. Use 'remaining' or 'sold'");
      error.statusCode = 400;
      throw error;
    }

    const seller = await sellerRepo.findByIdWithUser(sellerId);
    if (!seller) {
      const error = new Error("Seller profile not found");
      error.statusCode = 404;
      throw error;
    }

    return productRepo.findSellerProducts(sellerId, type);
  }
}

module.exports = new SellerService();
