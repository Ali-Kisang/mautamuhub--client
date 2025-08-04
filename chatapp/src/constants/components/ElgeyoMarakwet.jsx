import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const ElgeyoMarakwet = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchElgeyoMarakwetData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Elgeyo Marakwet (_id === "Elgeyo Marakwet")
        const elgeyoMarakwetVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Elgeyo Marakwet")
            ?.users || [];
        const elgeyoMarakwetRegularAccounts =
          regularAccountsByCounty.find(
            (county) => county._id === "Elgeyo Marakwet"
          )?.users || [];

        setVipAccounts(elgeyoMarakwetVIPAccounts);
        setRegularAccounts(elgeyoMarakwetRegularAccounts);

        showToast("Elgeyo Marakwet escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Elgeyo Marakwet data", error);
        showToast(
          "Failed to load Elgeyo Marakwet escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchElgeyoMarakwetData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Elgeyo Marakwet Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Elgeyo Marakwet", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[
          { _id: "Elgeyo Marakwet", users: regularAccounts },
        ]}
      />
    </HomeLayout>
  );
};

export default ElgeyoMarakwet;
