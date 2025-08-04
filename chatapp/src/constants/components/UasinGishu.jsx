import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../loader/Loader";
import { hideLoading, showLoading } from "../../redux/alertSlices";
import { showToast } from "../../toast/showToast";

const UasinGishu = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.alerts);

  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchUasinGishuData = async () => {
      dispatch(showLoading()); // Show Loader
      try {
        const response = await api.get("/counties/grouped");
        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for Uasin Gishu (_id === "Uasin Gishu")
        const uasinGishuVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Uasin Gishu")
            ?.users || [];
        const uasinGishuRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Uasin Gishu")
            ?.users || [];

        setVipAccounts(uasinGishuVIPAccounts);
        setRegularAccounts(uasinGishuRegularAccounts);

        showToast("Uasin Gishu escorts loaded successfully!", false);
      } catch (error) {
        console.error("Error fetching Uasin Gishu data", error);
        showToast(
          "Failed to load Uasin Gishu escorts. Please try again later.",
          true
        );
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchUasinGishuData();
  }, [dispatch]);

  return (
    <HomeLayout>
      {loading && <Loader />} {/* Show Loader */}
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Uasin Gishu Escorts
      </h1>
      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Uasin Gishu", users: vipAccounts }]}
      />
      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[
          { _id: "Uasin Gishu", users: regularAccounts },
        ]}
      />
    </HomeLayout>
  );
};

export default UasinGishu;
