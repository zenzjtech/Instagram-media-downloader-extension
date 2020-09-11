import { IGTV_CLASSNAME_IDENTIFIER
} from '../constants';

export function isInstPost(mediaNode) {
	return mediaNode.srcset && mediaNode.alt !== 'Instagram'
}

