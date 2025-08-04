/* eslint-disable react/display-name */
import { useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "flowbite-react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { showToast } from "../../toast/showToast";
import { showLoading, hideLoading } from "../../redux/alertSlices";
import Loader from "../../loader/Loader";
import Footer from "./Footer";
import sexyGirl from "../../../assets/sexy.jpg";

const BouncingEmoji = memo(() => (
  <motion.div
    animate={{ y: ["0%", "-20%", "0%"] }}
    transition={{
      duration: 1,
      ease: "easeIn",
      repeat: Infinity,
      repeatType: "mirror",
    }}
    style={{ fontSize: "2rem", display: "inline-block" }}
  >
    😜💦
  </motion.div>
));

const Redirect = () => {
  const [agree, setAgree] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.alerts);

  const handleAgreeChange = useCallback(() => {
    setAgree((prev) => !prev);
  }, []);

  const handleProceed = useCallback(() => {
    if (!agree) {
      dispatch(showLoading());
      showToast("Please agree to the terms and conditions.", true);
      dispatch(hideLoading());
      return;
    }

    dispatch(showLoading());
    showToast("You are redirected to create your escort account", false);

    setTimeout(() => {
      navigate("/create-escort-account");
      dispatch(hideLoading());
    }, 2000);
  }, [agree, dispatch, navigate]);

  return (
    <section>
      {loading && <Loader />}

      <div
        className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${sexyGirl})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 flex flex-col items-center text-center p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-pink mb-2 mt-2">
            Welcome to Our Exclusive Escort Community! <BouncingEmoji />
          </h1>
          <p className="text-gray-100 text-sm md:text-lg max-w-xl">
            Your perfect companion is just a call away! Whether you’re looking
            for charming, handsome men or beautiful, captivating women, find
            the closest match to your location and enjoy a premium experience. ✨
          </p>

          <div className="mt-6 p-6 md:p-10 bg-white shadow-2xl rounded-2xl max-w-lg w-full border-2 border-pink">
            <Button
              color="pink"
              size="lg"
              className="flex items-center justify-center w-full px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold transform transition duration-300 hover:scale-105 hover:bg-coralPink"
              onClick={handleProceed}
              disabled={loading}
            >
              <span className="text-gray-800">Proceed to post as an Escort</span>
              <HiOutlineArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6 text-gray-800" />
            </Button>

            <hr className="w-full border-2 border-coralPink my-6" />

            <a
              href="/chat-escort"
              className="text-pink-600 hover:text-coralPink text-base md:text-lg font-medium underline transition duration-300"
            >
              Skip and Chat with an Escort
            </a>

            <div className="flex items-center gap-2 text-gray-800 mt-6">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={handleAgreeChange}
                className="peer hidden"
              />
              <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex items-center justify-center peer-checked:border-coralPink peer-checked:bg-coralPink transition duration-300">
                {agree && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
              </div>
              <label
                htmlFor="terms"
                className="cursor-pointer hover:text-coralPink hover:underline transition duration-300"
              >
                Agree to terms and conditions
              </label>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Redirect;
