import { useEffect, useState } from "react";
import axios from "axios";

import SpasList from "./SpasList";
import VVIPList from "./VVIPList";
import VIPListByCounty from "./VIPListByCounty";
import RegularListByCounty from "./RegularListByCounty";
import HomeLayout from "./HomeLayout";
import Header from "./Header";

const Hero = () => {
  const server = "https://mautamuhub.com/api";
  const [users, setUsers] = useState({
    spas: [],
    vvipAccounts: [],
    vipAccountsByCounty: [],
    regularAccountsByCounty: [],
  });
  const [selectedCounty, setSelectedCounty] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${server}/counties/grouped`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users by selected county
  const filteredSpas = selectedCounty ? [] : users.spas;
  const filteredVVIPAccounts = selectedCounty ? [] : users.vvipAccounts;
  const filteredVIPAccountsByCounty = users.vipAccountsByCounty.filter(
    (account) => account.county === selectedCounty
  );
  const filteredRegularAccountsByCounty =
    users.regularAccountsByCounty.filter(
      (account) => account.county === selectedCounty
    );

  return (
    <>
      <Header />
      <HomeLayout onCountySelect={setSelectedCounty}>
        {loading ? (
          // 🔄 Loading State
          <div className="flex flex-col items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-pink-500"></span>
            <p className="mt-4 text-gray-600">Loading accounts...</p>
          </div>
        ) : selectedCounty ? (
          // ✅ Show County-specific VIP + Regular
          <div className="space-y-10">
            {/* VIP Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                VIP Accounts in {selectedCounty}
              </h2>
              {filteredVIPAccountsByCounty.length > 0 ? (
                <VIPListByCounty vipAccountsByCounty={filteredVIPAccountsByCounty} />
              ) : (
                <p className="text-gray-500 italic">
                  No VIP accounts available in this county.
                </p>
              )}
            </section>

            {/* Regular Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                Regular Accounts in {selectedCounty}
              </h2>
              {filteredRegularAccountsByCounty.length > 0 ? (
                <RegularListByCounty
                  regularAccountsByCounty={filteredRegularAccountsByCounty}
                />
              ) : (
                <p className="text-gray-500 italic">
                  No regular accounts available in this county.
                </p>
              )}
            </section>
          </div>
        ) : (
          // ✅ Show Default (Spas + VVIP)
          <div className="space-y-10">
            {/* Spas */}
            <section>
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                Featured Spas
              </h2>
              <SpasList spas={filteredSpas} />
            </section>

            {/* VVIP Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-pink-500 mb-4">
                Exclusive VVIP Accounts
              </h2>
              <VVIPList vvipAccounts={filteredVVIPAccounts} />
            </section>
          </div>
        )}
      </HomeLayout>
    </>
  );
};

export default Hero;
