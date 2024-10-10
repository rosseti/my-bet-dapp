import Image from "next/image";

const Footer = () => {
    return (
        <footer className="container mx-auto py-10 px-4 w-1/2">
            <div className="items-center text-center mb-10">
                <a href={`https://explorer.apothem.network/address/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`}
                    className="btn btn-primary shadow-lg btn-outline"
                    target="_blank">
                        <Image src="/xdc-icon.svg" alt="MetaMask" width={25} height={25} />
                        Smart Contract deployed on XDC Network
                </a>
            </div>

            <div className="items-center text-center">
                <p className="text-sm">&copy; 2024 BetCandidate. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
