// import React from "react";
// import { useTranslation } from "react-i18next";
// import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
// import { Link } from "react-router-dom";

// const JsFooter = () => {
//   const { t } = useTranslation();
//   return (
//     <>
//       <div className="d-md-flex text-center align-items-center justify-content-between">
//         <small>
//           © {new Date().getFullYear()} |{" "}
//           <Link to="/" className="text-secondary">
//           Pacific Technoproducts India Pvt. Ltd.
//           </Link>{" "}
//           | {t("All rights reserved")}
//         </small>
//         <span className="d-flex gap-4 my-md-0 my-2 justify-content-center">
//           {[
//             <BsFacebook className="facebook" />,
//             <BsLinkedin className="linkedin" />,
//             <BsInstagram className="instagram" />,
//             <BsTwitter className="twitter" />,
//           ].map((item, idx) => (
//             <span key={idx} className="my-btn d-align">
//               {item}
//             </span>
//           ))}
//         </span>
//       </div>
//     </>
//   );
// };

// export default JsFooter;


import React from "react";
import { useTranslation } from "react-i18next";
import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";

const JsFooter = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="d-md-flex text-center align-items-center justify-content-between">
        <small>
          © {new Date().getFullYear()} |{" "}
          <Link to="/" className="text-secondary">
            Pacific Technoproducts India Pvt. Ltd.
          </Link>{" "}
          | {t("All rights reserved")}
        </small>
        <span className="d-flex gap-4 my-md-0 my-2 justify-content-center">
          {[
            { icon: <BsFacebook className="facebook" />, url: "https://www.facebook.com/pacifictechnoproductspvtltd/" },
            { icon: <BsLinkedin className="linkedin" />, url: "https://www.linkedin.com/company/pacific-techno-products-pvt-ltd/" },
            { icon: <BsInstagram className="instagram" />, url: "https://www.instagram.com/pacifictechnoproductspvtltd/" },
            { icon: <BsTwitter className="twitter" />, url: "https://x.com/TechnoPacific" },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="my-btn d-align"
            >
              {item.icon}
            </a>
          ))}
        </span>
      </div>
    </>
  );
};

export default JsFooter;
