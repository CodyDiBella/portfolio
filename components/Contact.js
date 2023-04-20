import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineChevronDoubleUp } from 'react-icons/hi';
import emailjs, { init } from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm('service_snxpmua', 'template_pwup3ho', e.target, '1YtH3_3L4agOfqLYw')
      .then(
        (result) => {
          console.log(result.text);
          setFormData({
            name: '',
            phone: '',
            email: '',
            subject: '',
            message: '',
          });
          setSubmitStatus('success');
        },
        (error) => {
          console.log(error.text);
          setSubmitStatus('error');
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
                  src="https://ponderosa-scusd-ca.schoolloop.com/pf4/cms2/://cdn.schoolloop.com/uimgcdn/aHR0cDovL3BvbmRlcm9zYS1zY3VzZC1jYS5zY2hvb2xsb29wLmNvbS91aW1nL2ZpbGUvMTQ3MDExOTk0NTI2Ni8zNjg1MDI1MjA1NjA0ODI3ODg2LnBuZz8xNDcyNDAxNjIzMDM3"
                  alt="/"
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
              <a href="https://www.linkedin.com/in/codydibella/" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100">
                  <FaLinkedinIn />
                </div>
              </a>
              <a href="https://github.com/codydibella" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100">
                  <FaGithub />
                </div>
              </a>
              <a href="mailto:codibella@gmail.com">
                <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100">
                  <AiOutlineMail />
                </div>
              </a>
              <a href="https://www.dropbox.com/s/rsz71r75xnghb3k/CodyDiBella_Resume.pdf?dl=0" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full shadow-lg shadow-gray-400 p-6 cursor-pointer hover:scale-110 ease-in duration-100">
                  <BsFillPersonLinesFill />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-3 w-full h-auto shadow-xl shadow-gray-400 rounded-xl lg:p-4">
        <div className="p-4">
        <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4 w-full py-2">
              <div className="flex flex-col">
                <label className="uppercase text-sm py-2">Name</label>
                <input
                  className="border-2 rounded-lg p-3 flex border-gray-300"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label className="uppercase text-sm py-2">
                  Phone Number
                </label>
                <input
                  className="border-2 rounded-lg p-3 flex border-gray-300"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col py-2">
              <label className="uppercase text-sm py-2">Email</label>
              <input
                className="border-2 rounded-lg p-3 flex border-gray-300"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col py-2">
              <label className="uppercase text-sm py-2">Subject</label>
              <input
                className="border-2 rounded-lg p-3 flex border-gray-300"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col py-2">
              <label className="              uppercase text-sm py-2">Message</label>
              <textarea
                className="border-2 rounded-lg p-3 flex border-gray-300"
                rows="10"
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            {submitStatus === 'success' && (
              <p className="text-green-500">
                Your message has been sent successfully!
              </p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-500">
                There was an error sending your message. Please try again.
              </p>
            )}
            <button className="w-full p-4 text-gray-100 mt-4">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
    <div className="flex justify-center py-12">
        <Link href='/'>
        <div className="rounded-full shadow-lg shadow-gray-400 p-4 cursor-pointer hover:scale-110 ease-in duration-100">
            <HiOutlineChevronDoubleUp className="text-[#8746cd]" size={30}/>
        </div>
        </Link>
    </div>
  </div>
</div>
  );
};

export default Contact;
