import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name?: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Mission Acknowledged. Welcome to the ZeroPilot Fleet.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
            <div style={logoWrapper}>
                <span style={logoChar}>Z</span>
            </div>
        </Section>
        <Heading style={heading}>Welcome aboard, {name || "Pilot"}.</Heading>
        <Text style={paragraph}>
          The future of Instagram automation is almost here. You&apos;ve successfully secured your spot on our exclusive early access list.
        </Text>
        <Text style={paragraph}>
          ZeroPilot isn&apos;t just another bot. It&apos;s a high-performance engine designed to scale your engagement, handle your DMs, and drive your conversions while you sleep.
        </Text>
        <Section style={btnContainer}>
          <Link style={button} href="https://zero-pilot.vercel.app">
            Visit Your Port
          </Link>
        </Section>
        <Text style={paragraph}>
          We will notify you the moment we launch. In the meantime, if you have any questions, our flight support team is ready:
        </Text>
        <Section style={supportSection}>
           <Text style={supportText}>📧 blackbytenp@gmail.com</Text>
           <Text style={supportText}>📞 9820987206</Text>
        </Section>
        <Text style={footer}>
          ZeroPilot | Developed by Vishesh Jha.
          <br />
          Elite AI Automation for the modern creator.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  width: "580px",
  border: "1px solid #333333",
  borderRadius: "12px",
  marginTop: "40px",
  backgroundImage: "linear-gradient(to bottom, #111111, #000000)",
};

const logoContainer = {
  padding: "20px 0",
  textAlign: "center" as const,
};

const logoWrapper = {
    width: "40px",
    height: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
};

const logoChar = {
    color: "#000000",
    fontWeight: "900",
    fontSize: "20px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  color: "#ffffff",
  letterSpacing: "-0.5px",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "26px",
  color: "#888888",
  textAlign: "center" as const,
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#ffffff",
  borderRadius: "100px",
  color: "#000000",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 30px",
};

const supportSection = {
    backgroundColor: "#111111",
    borderRadius: "8px",
    padding: "15px",
    margin: "20px 0",
    textAlign: "center" as const,
    border: "1px solid #222222",
};

const supportText = {
    color: "#ffffff",
    fontSize: "12px",
    margin: "5px 0",
    fontWeight: "600",
};

const footer = {
  color: "#555555",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "40px",
  textAlign: "center" as const,
};
