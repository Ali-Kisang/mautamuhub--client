import { useState, useEffect } from "react";

import HomeLayout from "./HomeLayout";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import api from "../../utils/axiosInstance";


const TaitaTaveta = () => {
  const [vipAccounts, setVipAccounts] = useState([]);
  const [regularAccounts, setRegularAccounts] = useState([]);

  useEffect(() => {
    const fetchTaitaTavetaData = async () => {
      try {
        const response = await api.get("/counties/grouped");
        console.log(response.data);

        const { vipAccountsByCounty, regularAccountsByCounty } = response.data;

        // Filter data specifically for TaitaTaveta (_id === "TaitaTaveta")
        const taitaTavetaVIPAccounts =
          vipAccountsByCounty.find((county) => county._id === "Taita Taveta")
            ?.users || [];
        const taitaTavetaRegularAccounts =
          regularAccountsByCounty.find((county) => county._id === "Taita Taveta")
            ?.users || [];

        setVipAccounts(taitaTavetaVIPAccounts);
        setRegularAccounts(taitaTavetaRegularAccounts);
      } catch (error) {
        console.error("Error fetching TaitaTaveta data", error);
      }
    };

    fetchTaitaTavetaData();
  }, []);

  return (
    <HomeLayout>
      <h1 className="text-2xl font-bold mb-4 text-pink text-center">
        Welcome to Taita Taveta Escorts
      </h1>

      {/* VIP Accounts */}
      <VIPListByCounty
        vipAccountsByCounty={[{ _id: "Taita Taveta", users: vipAccounts }]}
      />

      {/* Regular Accounts */}
      <RegularListByCounty
        regularAccountsByCounty={[{ _id: "Taita Taveta", users: regularAccounts }]}
      />
    </HomeLayout>
  );
};

export default TaitaTaveta;
