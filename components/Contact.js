import Link from "next/link";
import React, { useState, useRef } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineChevronDoubleUp } from "react-icons/hi";
import emailjs from "emailjs-com";
import { Input, Textarea, Button } from "@nextui-org/react";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);

  const recaptchaRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCaptcha = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please verify you are not a robot.");
      return;
    }

    setIsSubmitting(true);

    emailjs
      .sendForm(
        "service_snxpmua",
        "template_pwup3ho",
        e.target,
        "1YtH3_3L4agOfqLYw"
      )
      .then(
        (result) => {
          console.log(result.text);
          setSubmitStatus("success");

          // ✅ Clear the success message after 5 seconds
          setTimeout(() => {
            setSubmitStatus(null);
          }, 5000);

          // ✅ Reset the form
          setFormData({
            name: "",
            phone: "",
            email: "",
            subject: "",
            message: "",
          });

          // ✅ Reset captcha
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
          setCaptchaToken(null);
        },
        (error) => {
          console.log(error.text);
          setSubmitStatus("error");
        }
      )
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div id="contact" className="w-full lg:h-screen">
      <div className="max-w-[1240px] m-auto px-2 py-16 w-full">
        <p className="text-xl tracking-widest uppercase text-[5651e5]">
          Contact
        </p>
        <h2 className="py-4">Get In Touch</h2>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="col-span-3 lg:col-span-2 w-full h-full shadow-xl shadow-gray-400 rounded-xl p-4">
            <div className="lg:p-4 h-full">
              <div>
                <img
                  className="rounded-xl hover:scale-110 ease-in duration-200"
                  src="/assets/CD.png"
                  alt="/"
                  width="50"
                  height="5"
                />
              </div>
              <div>
                <h2 className="py-2">Cody DiBella</h2>
                <p>Full Stack Developer</p>
                <p className="py-4">
                  I am currently looking for work. Please don't hesitate to get
                  a hold of me.
                </p>
              </div>
              <div>
                <p className="pt-8 text-[#8746cd]">
                  Did we just become best friends?
                </p>
                <div className="flex items-center justify-between py-4">
                  <a
                    href="https://www.linkedin.com/in/codydibella/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      bordered
                      color="secondary"
                      auto
                      className="rounded-full shadow-lg shadow-Purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100"
                    >
                      <FaLinkedinIn />
                    </Button>
                  </a>
                  <a
                    href="https://github.com/codydibella"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      bordered
                      color="secondary"
                      auto
                      className="rounded-full shadow-lg shadow-Purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100"
                    >
                      <FaGithub />
                    </Button>
                  </a>
                  <a href="mailto:codibella@gmail.com">
                    <Button
                      bordered
                      color="secondary"
                      auto
                      className="rounded-full shadow-lg shadow-Purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100"
                    >
                      <AiOutlineMail />
                    </Button>
                  </a>
                  <a
                    href="https://www.dropbox.com/scl/fi/ykg26nap7v6ebavv07qbw/CodyDiBella_Resume2023.pdf?rlkey=f1nfh80b880q0ke279haj4khp&dl=0"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      bordered
                      color="secondary"
                      auto
                      className="rounded-full shadow-lg shadow-Purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100"
                    >
                      <BsFillPersonLinesFill />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- FORM ---------- */}
          <div className="col-span-3 w-full h-auto shadow-xl shadow-gray-400 rounded-xl lg:p-4">
            <div className="p-4">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 w-full py-2">
                  <Input
                    type="text"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    type="text"
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col py-2">
                  <Input
                    type="email"
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col py-2">
                  <Input
                    type="text"
                    name="subject"
                    label="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col py-2">
                  <Textarea
                    rows="10"
                    name="message"
                    label="Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ✅ reCAPTCHA */}
                <div className="py-4">
                  <ReCAPTCHA
                    sitekey="6LcGCusrAAAAAGe-JYqeYSciOJwmSbzr9olhe2Fy"
                    onChange={handleCaptcha}
                    ref={recaptchaRef}
                  />
                </div>

                {submitStatus === "success" && (
                  <p className="text-green-500">
                    ✅ Your message has been sent successfully!
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-500">
                    ❌ There was an error sending your message. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-4 text-gray-100 mt-4 bg-[#8746cd] rounded-lg"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-12">
          <Link href="/">
            <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-100">
              <HiOutlineChevronDoubleUp className="text-[#8746cd]" size={30} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
