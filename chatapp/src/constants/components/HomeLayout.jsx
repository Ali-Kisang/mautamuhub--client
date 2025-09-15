
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";

const countyMenu = [
  { name: "Mombasa", path: "/mombasa-escorts", countyCode: 1 },
  { name: "Kwale", path: "/kwale-escorts", countyCode: 2 },
  { name: "Kilifi", path: "/kilifi-escorts", countyCode: 3 },
  { name: "Tana River", path: "/tana-river-escorts", countyCode: 4 },
  { name: "Lamu", path: "/lamu-escorts", countyCode: 5 },
  { name: "Taita Taveta", path: "/taita-taveta-escorts", countyCode: 6 },
  { name: "Garissa", path: "/garissa-escorts", countyCode: 7 },
  { name: "Wajir", path: "/wajir-escorts", countyCode: 8 },
 { name: "Mandera", path: "/mandera-escorts", countyCode: 9 },
  { name: "Marsabit", path: "/marsabit-escorts", countyCode: 10 },
  { name: "Isiolo", path: "/isiolo-escorts", countyCode: 11 },
  { name: "Meru", path: "/meru-escorts", countyCode: 12 },
  { name: "Tharaka Nithi", path: "/tharaka-nithi-escorts", countyCode: 13 },
  { name: "Embu", path: "/embu-escorts", countyCode: 14 },
  { name: "Kitui", path: "/kitui-escorts", countyCode: 15 },
  { name: "Machakos", path: "/machakos-escorts", countyCode: 16 },
  { name: "Makueni", path: "/makueni-escorts", countyCode: 17 },
  { name: "Nyandarua", path: "/nyandarua-escorts", countyCode: 18 },
  { name: "Nyeri", path: "/nyeri-escorts", countyCode: 19 },
  { name: "Kirinyaga", path: "/kirinyaga-escorts", countyCode: 20 },
  { name: "Murang'A", path: "/muranga-escorts", countyCode: 21 },
  { name: "Kiambu", path: "/kiambu-escorts", countyCode: 22 },
  { name: "Turkana", path: "/turkana-escorts", countyCode: 23 },
  { name: "West Pokot", path: "/west-pokot-escorts", countyCode: 24 },
  { name: "Samburu", path: "/samburu-escorts", countyCode: 25 },
  { name: "Trans Nzoia", path: "/trans-nzoia-escorts", countyCode: 26 },
  { name: "Uasin Gishu", path: "/uasin-gishu-escorts", countyCode: 27 },
  { name: "Elgeyo Marakwet", path: "/elgeyo-marakwet-escorts", countyCode: 28 },
  { name: "Nandi", path: "/nandi-escorts", countyCode: 29 },
  { name: "Baringo", path: "/baringo-escorts", countyCode: 30 },
  { name: "Laikipia", path: "/laikipia-escorts", countyCode: 31 },
  { name: "Nakuru", path: "/nakuru-escorts", countyCode: 32 },
  { name: "Narok", path: "/narok-escorts", countyCode: 33 },
  { name: "Kajiado", path: "/kajiado-escorts", countyCode: 34 },
  { name: "Kericho", path: "/kericho-escorts", countyCode: 35 },
  { name: "Bomet", path: "/bomet-escorts", countyCode: 36 },
  { name: "Kakamega", path: "/kakamega-escorts", countyCode: 37 },
  { name: "Vihiga", path: "/vihiga-escorts", countyCode: 38 },
  { name: "Bungoma", path: "/bungoma-escorts", countyCode: 39 },
  { name: "Busia", path: "/busia-escorts", countyCode: 40 },
  { name: "Siaya", path: "/siaya-escorts", countyCode: 41 },
  { name: "Kisumu", path: "/kisumu-escorts", countyCode: 42 },
  { name: "Homa Bay", path: "/homa-bay-escorts", countyCode: 43 },
  { name: "Migori", path: "/migori-escorts", countyCode: 44 },
  { name: "Kisii", path: "/kisii-escorts", countyCode: 45 },
  { name: "Nyamira", path: "/nyamira-escorts", countyCode: 46 },
  { name: "Nairobi", path: "/nairobi-escorts", countyCode: 47 },
  // Add all other counties...
];

const HomeLayout = ({ children }) => {
  const location = useLocation();

  return (
    <>
  {/* Locations (grid display) */}
  <div className="w-full bg-gradient-to-br from-rose-100 via-pink-300 to-pink-400 p-4 rounded-lg shadow">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {countyMenu.map((county) => {
        const isActive = location.pathname === county.path;

        return (
          <motion.div
            key={county.countyCode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            {isActive ? (
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 0 0px rgba(236,72,153,0.0)",
                    "0 0 20px rgba(236,72,153,0.6)",
                    "0 0 0px rgba(236,72,153,0.0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-lg"
              >
                <Link
                  to={county.path}
                  className="block w-full text-center px-4 py-2 rounded-lg bg-pink-500 text-white font-medium shadow hover:bg-pink-600 transition"
                >
                  {county.name}
                </Link>
              </motion.div>
            ) : (
              <Link
                to={county.path}
                className="block w-full text-center px-4 py-2 rounded-lg border border-pink-400 text-pink-600 font-medium hover:bg-pink-50 transition"
              >
                {county.name}
              </Link>
            )}
          </motion.div>
        );
      })}
    </div>
  </div>

  {/* Main Content */}
  <motion.main
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-4 rounded-lg shadow"
  >
    {children}
  </motion.main>

  <Footer />
</>

  );
};

export default HomeLayout;
