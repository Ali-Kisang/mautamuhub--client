import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Bungoma = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchBungomaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Bungoma (_id === "Bungoma")
        const bungomaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Bungoma")
            ?.users || [];
        const bungomaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Bungoma")
            ?.users || [];

        setVipAccounts(bungomaVIPAccounts);
        setRegularAccounts(bungomaRegularAccounts);

        showToast("Bungoma escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Bungoma data", error);
        showToast(
          "Failed to load Bungoma escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchBungomaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Bungoma Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Bungoma", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Bungoma", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Bungoma;
