import { Styled } from "./styled";
import ar_logo from "../../assets/ar_logo.png";
import { NavLink } from "react-router-dom";

export default function Footer() {
    return (
        <Styled.Wrapper role="contentinfo">
            <Styled.Col>&copy; {new Date().getFullYear()}</Styled.Col>

            <Styled.Col>
                By{" "}
                <a
                    href="https://www.ashishranjan.net"
                    target="_blank"
                    title="Ashish Ranjan"
                >
                    <img src={ar_logo} alt="Ashish Ranjan logo" />
                </a>
            </Styled.Col>
        </Styled.Wrapper>
    );
}
