import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Kiambu = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKiambuData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kiambu (_id === "Kiambu")
        const kiambuVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kiambu")
            ?.users || [];
        const kiambuRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kiambu")
            ?.users || [];

        setVipAccounts(kiambuVIPAccounts);
        setRegularAccounts(kiambuRegularAccounts);

        showToast("Kiambu escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kiambu data", error);
        showToast(
          "Failed to load Kiambu escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKiambuData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kiambu Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kiambu", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kiambu", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kiambu;
