import {
    FaCodepen,
    FaCoffee,
    FaEnvelope,
    FaFacebook,
    FaGithub,
    FaGlobe,
    FaHandHoldingHeart,
    FaLinkedin,
    FaPatreon,
    FaYoutube,
} from "react-icons/fa";
import { createElement } from "react"; import { Styled } from "./styled";

const links = [
    { label: "Portfolio", href: "https://www.ashishranjan.net/", icon: FaGlobe },
    { label: "GitHub", href: "https://github.com/a2rp", icon: FaGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: FaCodepen },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: FaLinkedin },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: FaFacebook },
    { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FaYoutube },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: FaEnvelope },
];

const supportLinks = [
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: FaHandHoldingHeart },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/a2rp", icon: FaCoffee },
    { label: "Patreon", href: "https://www.patreon.com/a2rp", icon: FaPatreon },
];

function LinkGroup({ items }) {
    return (
        <Styled.LinkGroup aria-label="Footer links">
            {items.map(({ label, href, icon }) => (
                <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                    {createElement(icon, { size: 16, "aria-hidden": true })}
                </a>
            ))}
        </Styled.LinkGroup>
    );
}

export default function Footer() {
    return (
        <Styled.Wrapper role="contentinfo">
            <Styled.Copyright>
                Copyright Â© {new Date().getFullYear()}{" "}
                <a
                    href="https://www.ashishranjan.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Ashish Ranjan
                </a>
            </Styled.Copyright>
            <Styled.Groups>
                <LinkGroup items={links} />
                <LinkGroup items={supportLinks} />
            </Styled.Groups>
        </Styled.Wrapper>
    );
}