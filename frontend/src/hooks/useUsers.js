import publicApi from "../api/publicApi";
import { useState, useEffect } from "react";

export default function useUsers(userId = null) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [seller, setSeller] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchData = async () => {
            try {
                if (userId) {
                    const data = await publicApi.getSeller(userId);
                    setSeller(data);
                }
            } catch (err) {
                setError(err.message || "Failed to fetch seller");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    return { seller, loading, error };
}
