function LoadBalancer(ip) {
    const hashvalue = hashIP(ip);
    const nodeindex = hashvalue % nodes.length;
    const selectednode = nodes[nodeindex];
    identifyNode(ip, selectednode);
    return identifyNode;
}
module.exports = LoadBalancer;
