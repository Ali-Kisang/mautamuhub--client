import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const Kericho = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchKerichoData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Kericho (_id === "Kericho")
        const kerichoVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Kericho")
            ?.users || [];
        const kerichoRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Kericho")
            ?.users || [];

        setVipAccounts(kerichoVIPAccounts);
        setRegularAccounts(kerichoRegularAccounts);

        showToast("Kericho escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Kericho data", error);
        showToast(
          "Failed to load Kericho escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchKerichoData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Kericho Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Kericho", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Kericho", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default Kericho;
