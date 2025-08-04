import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Makueni = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchMakueniData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Makueni (_id === "Makueni")
        const makueniVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Makueni")?.users ||
          [];
        const makueniRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Makueni")
            ?.users || [];

        setVipAccounts(makueniVIPAccounts);
        setRegularAccounts(makueniRegularAccounts);

        showToast("Makueni escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Makueni data", error);
        showToast(
          "Failed to load Makueni escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchMakueniData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Makueni Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Makueni", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Makueni", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Makueni;
