const express = require("express");
const app = express();
app.use(express.json());
// the given codes in the task
// Random IP generator
function generateRandomIP() {
return Array.from({ length: 4 }, () => Math.floor(Math.random() *
256)).join(".");
}
// lets create a hash function to generate a hash value for the incoming ip adresses
function hashIP(ip){
    let hash = 0;
    for(let i = 0; i<ip.length;i++){
        hash = (hash * 31 + ip.charCodeAt(i)) % 1000000007; 
    }
    return hash;
}
// List of nodes
const nodes = ["Node-A", "Node-B", "Node-C"];
function identifyNode(ip, selectedNode) {
console.log(`Incoming IP: ${ip} → Routed to: ${selectedNode}`);
}
// helath check for nodes
const nodestatus = {
    "Node-A": true,
    "Node-B": true,
    "Node-C": true
}
function LoadBalancer(ip) {
    const hashvalue = hashIP(ip);
    let nodeindex = hashvalue % nodes.length;
    let selectednode = nodes[nodeindex];
    while(!nodestatus[selectednode]){
        nodeindex = (nodeindex+1)%nodes.length;
        selectednode = nodes[nodeindex];
    }
    identifyNode(ip, selectednode);
    return selectednode;
}
app.post("/route",(req,res)=>{
    const {ip} = req.body;
    if(!ip){
        return res.status(400).json({
            msg:"ip adress is not entered"
        })
    }
    const result = LoadBalancer(ip);
    res.status(200).json({
        msg:"request routed successfully",
        node:result
    })
})
app.get("/simulate",(req,res)=>{
    const count = parseInt(req.query.count) || 10; // defaulted to 10 if not provided 
    const results = []// made a in memory database to store the results of the simulation
    for(let i  = 0; i<count; i++){
        const randomip = generateRandomIP();
        const node = LoadBalancer(randomip);
        results.push({
            ip:randomip,
            node:node
        })
    }
    res.status(200).json({
        msg:"simulation completed",
        data:results
    })

})
// health check endpoint for nodes
app.post("/health",(req,res)=>{
    const {node,status} = req.body;
    if(!nodestatus.hasOwnProperty(node)){
        return res.status(400).json({
            msg:"invalid node name"
        })
    }
    nodestatus[node]= status;
    res.status(200).json({
        msg:"node status updated successfully",
        node:node,
        status:status
    })
})
const port  = 3000;
app.listen(port,()=>{
    console.log(`server is running on port${port}`);
}) 
