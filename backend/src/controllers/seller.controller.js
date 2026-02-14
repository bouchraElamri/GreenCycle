const sellerService = require('../services/seller.service');

class SellerController {
  /**
   * Handle switch to seller request
   * POST /api/sellers/switch-to-seller
   */
  async switchToSeller(req, res) {
    try {
      const userId = req.user.id; // from authenticate middleware
      const sellerData = req.body;

      const sellerProfile = await sellerService.switchToSeller(userId, sellerData);

      return res.status(201).json({
        success: true,
        message: 'Successfully switched to seller',
        data: sellerProfile
      });
    } catch (error) {
      console.error('Switch to seller error:', error);

      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message
        });
      }

      // Handle specific errors
      if (error.message === 'User not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'User is already a seller' || 
          error.message === 'Seller profile already exists for this user') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Seller profile already exists for this user'
        });
      }

      // Generic error
      return res.status(500).json({
        success: false,
        message: 'Failed to switch to seller',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get current seller profile
   * GET /api/sellers/profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const sellerProfile = await sellerService.getSellerProfile(userId);

      return res.status(200).json({
        success: true,
        data: sellerProfile
      });
    } catch (error) {
      console.error('Get seller profile error:', error);

      if (error.message === 'Seller profile not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve seller profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new SellerController();
