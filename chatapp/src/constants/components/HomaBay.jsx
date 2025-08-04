import { useState, useEffect } from "react";
import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const HomaBay = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchHomaBayData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Homa Bay (_id === "Homa Bay")
        const homaBayVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Homa Bay")
            ?.users || [];
        const homaBayRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Homa Bay")
            ?.users || [];

        setVipAccounts(homaBayVIPAccounts);
        setRegularAccounts(homaBayRegularAccounts);

        showToast("Homa Bay escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Homa Bay data", error);
        showToast(
          "Failed to load Homa Bay escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchHomaBayData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Homa Bay Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Homa Bay", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Homa Bay", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default HomaBay;
