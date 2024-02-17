import React from "react";
import properties from '../properties.json'
import { Link } from "@mui/material";

const Footer = () => {
    const version = properties.version;

    return <div>
        <div>version: {version}</div>
        <Link href="https://github.com/The-Clayman/Broadcaster/">https://github.com/The-Clayman/Broadcaster/</Link>
    </div>;

}

export default Footer;