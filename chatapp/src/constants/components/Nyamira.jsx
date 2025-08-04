import { useState, useEffect } from "react";
import api from "../../utils/axiosInstance";
import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Nyamira = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchNyamiraData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Nyamira (_id === "Nyamira")
        const nyamiraVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Nyamira")
            ?.users || [];
        const nyamiraRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Nyamira")
            ?.users || [];

        setVipAccounts(nyamiraVIPAccounts);
        setRegularAccounts(nyamiraRegularAccounts);

        showToast("Nyamira escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Nyamira data", error);
        showToast(
          "Failed to load Nyamira escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchNyamiraData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Nyamira Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Nyamira", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Nyamira", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Nyamira;
