export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","images/backgrounds/bg_placeholder.png","images/characters/char_placeholder.png","sounds/bgm/bgm_placeholder.mp3"]),
	mimeTypes: {".png":"image/png",".mp3":"audio/mpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.EozxFxbR.js",app:"_app/immutable/entry/app.DuiDb9k7.js",imports:["_app/immutable/entry/start.EozxFxbR.js","_app/immutable/chunks/BBEYF-w2.js","_app/immutable/chunks/BwrWARzO.js","_app/immutable/chunks/MIiKQaen.js","_app/immutable/entry/app.DuiDb9k7.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/BwrWARzO.js","_app/immutable/chunks/IHki7fMi.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
