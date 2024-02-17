import React from "react";
import properties from '../properties.json'
import { Link } from "@mui/material";

const version = properties.version;

const Footer = () => {
    

    return <div style={{
        bottom: 0,
        left: 0
        }}>
        <div>version: {version}</div>
        <Link href="https://github.com/The-Clayman/Broadcaster/">https://github.com/The-Clayman/Broadcaster/</Link>
    </div>;

}

export default Footer;