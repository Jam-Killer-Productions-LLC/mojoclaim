import { ConnectButton } from "thirdweb/react";
import MojoClaimIcon from "./assets/PPs.svg";
import ClaimButton from "./components/ClaimButton.jsx" ;
import { client } from "/src/client.js";

export function App() {
	return (
	<div className="background">
	  <div className="content">
		<img src="https://bafybeig6dpytw3q4v7vzdy6sb7q4x3apqgrvfi3zsbvb3n6wvs5unfr36i.ipfs.dweb.link?filename=480.gif" alt="Mojo Logo" />
		<h1>Mojo Claim</h1>
		<div className="flex justify-center mb-20">
					<ConnectButton
						client={client}
						appMetadata={{
							name: "Mojo Claim ",
							url: "https://mojoclaim.producerprotocol.pro",
						}}
					/>
				</div>
	  </div>
	</div>
	);
}

		