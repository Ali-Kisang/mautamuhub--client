import { useState, useEffect } from "react";
import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";

import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";

import { showToast } from "../../toast/showToast";
import api from "../../utils/axiosInstance";
import { hideLoading, showLoading } from "../../redux/alertSlices";

const Nairobi = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchNairobiData = async () => {
      dispatch(showLoading()); 
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Nairobi (_id === "Nairobi")
        const nairobiVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Nairobi")
            ?.users || [];
        const nairobiRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Nairobi")
            ?.users || [];

        setVipAccounts(nairobiVIPAccounts);
        setRegularAccounts(nairobiRegularAccounts);

        showToast("Nairobi escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Nairobi data", error);
        showToast(
          "Failed to load Nairobi escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchNairobiData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Nairobi Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Nairobi", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Nairobi", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Nairobi;
