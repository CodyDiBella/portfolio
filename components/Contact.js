import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineChevronDoubleUp } from 'react-icons/hi';
import emailjs, { init } from 'emailjs-com';
import { Input, Textarea, Button } from '@nextui-org/react'

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
                  src="data:image/png;base64,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"
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
                <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-Purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                  <FaLinkedinIn />
                </Button>
              </a>
              <a href="https://github.com/codydibella" target="_blank" rel="noopener noreferrer">
                <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-Purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                  <FaGithub />
                </Button>
              </a>
              <a href="mailto:codibella@gmail.com">
                <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-Purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                  <AiOutlineMail />
                </Button>
              </a>
              <a href="https://www.dropbox.com/scl/fi/ykg26nap7v6ebavv07qbw/CodyDiBella_Resume2023.pdf?rlkey=f1nfh80b880q0ke279haj4khp&dl=0" target="_blank" rel="noopener noreferrer">
                <Button bordered color="secondary" auto className="rounded-full shadow-lg shadow-Purple-400 p-3 cursor-pointer hover:scale-110 ease-in duration-100">
                  <BsFillPersonLinesFill />
                </Button>
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
                <Input
                  type="text"
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <Input
                  type="text"
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col py-2">
              <Input                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col py-2">
              <Input
                type="text"
                name="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col py-2">
              <Textarea
                rows="10"
                name="message"
                label="Message"
                value={formData.message}
                onChange={handleChange}
              />
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
