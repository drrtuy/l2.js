# l2net spec

### p2p channel protocol
A - one party (with private key)
B - second party (with private key)

1.Open channel (on-chain):
A deposit value, notify B
B deposit value (optional), notify A

2.Send value/state (off-chain):
A|B sends value p2p (signed params[CA,vA,vB,]), A|B must be online 

3.Close channel (on-chain):
3.1 A|B start closing, notify A|B
3.2 A|B update/penalty closing, notify A|B
3.3 A|B finish closing, notify A|B

### h2h channel protocol

### p2h channel protocol
