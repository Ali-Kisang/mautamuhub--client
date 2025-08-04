import { useState, useEffect } from "react";
import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";
const Turkana = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchTurkanaData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Turkana (_id === "Turkana")
        const turkanaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Turkana")
            ?.users || [];
        const turkanaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Turkana")
            ?.users || [];

        setVipAccounts(turkanaVIPAccounts);
        setRegularAccounts(turkanaRegularAccounts);

        showToast("Turkana escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Turkana data", error);
        showToast(
          "Failed to load Turkana escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchTurkanaData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Turkana Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Turkana", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Turkana", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Turkana;
