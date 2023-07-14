import FlutterJobs from "@/public/assets/png/flutter-jobs-color.svg";
import Image from "next/image";
import Link from "next/link";
import MagneticButton from "../custom/magnetic-button";
import React from "react";
import styles from "@/app/scss/comps/individual/Header.module.css";

function Header() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.content}>
          <Link href="/" passHref>
            <Image src={FlutterJobs} alt="Flutter Jobs" />
          </Link>
          <MagneticButton buttonText="Post Job" />
        </div>
      </div>
    </>
  );
}

export default Header;
