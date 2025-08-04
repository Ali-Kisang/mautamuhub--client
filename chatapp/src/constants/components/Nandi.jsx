import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Nandi = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchNandiData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Nandi (_id === "Nandi")
        const nandiVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Nandi")?.users ||
          [];
        const nandiRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Nandi")
            ?.users || [];

        setVipAccounts(nandiVIPAccounts);
        setRegularAccounts(nandiRegularAccounts);

        showToast("Nandi escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Nandi data", error);
        showToast(
          "Failed to load Nandi escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchNandiData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Nandi Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Nandi", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Nandi", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Nandi;
