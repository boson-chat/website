import { joinUrl } from './pages/discover/directory';

/** The Boson community: #lobby on irc.boson.chat, as it's listed in the directory. */
export const COMMUNITY = { hostname: 'irc.boson.chat', port: 6697, tls: true, name: 'Boson', channel: '#lobby' };

/** boson:// link that connects the app to the community server. */
export const COMMUNITY_JOIN_URL = joinUrl(COMMUNITY);
