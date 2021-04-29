import { useEffect, useState } from "react";

export default function usePath() {
	const [path, setPath] = useState(window.location.pathname);

	useEffect(() => {
		window.addEventListener("popstate", handlePopstate);
		return () => window.removeEventListener("popstate", handlePopstate);
	}, []);

	function handlePopstate() {
		setPath(window.location.pathname);
	}

	return path;
}
