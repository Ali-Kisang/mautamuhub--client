import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Kakamega = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKakamegaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kakamega (_id === "Kakamega")
        const kakamegaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kakamega")
            ?.users || [];
        const kakamegaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kakamega")
            ?.users || [];

        setVipAccounts(kakamegaVIPAccounts);
        setRegularAccounts(kakamegaRegularAccounts);

        showToast("Kakamega escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kakamega data", error);
        showToast(
          "Failed to load Kakamega escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKakamegaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kakamega Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kakamega", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kakamega", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kakamega;
