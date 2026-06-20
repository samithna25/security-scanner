//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DCGtjPNP.js
var manifest = { "5cc5658d589994a318f596f14b1289fc3c8fc7829910e7681bc0f5e9a7be83e5": {
	functionName: "scanWebsiteServer_createServerFn_handler",
	importer: () => import("./_ssr/scan-CXYiPNRt.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
