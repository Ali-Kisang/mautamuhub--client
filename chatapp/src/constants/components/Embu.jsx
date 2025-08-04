import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";

const Embu = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchEmbuData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Embu (_id === "Embu")
        const embuVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Embu")?.users ||
          [];
        const embuRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Embu")
            ?.users || [];

        setVipAccounts(embuVIPAccounts);
        setRegularAccounts(embuRegularAccounts);

        showToast("Embu escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Embu data", error);
        showToast(
          "Failed to load Embu escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchEmbuData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Embu Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Embu", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Embu", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Embu;
