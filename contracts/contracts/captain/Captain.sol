// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/access/AccessControl.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

// import "../NVYGameLibrary.sol";
// import "../token/IToken.sol";

// contract Captain is ERC721URIStorage, AccessControl {
//     IToken private nvyToken;

//     mapping(uint256 => NVYGameLibrary.CaptainStats) public idToCaptains;

//     // Captaint could be created only by NVY Backend after buying
//     bytes32 public constant NVY_BACKEND = keccak256("NVY_BACKEND");

//     // To keep track of island id's
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;

//     constructor() public ERC721("CAPT", "NVYCAPT") {
//         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
//     }

//     function grantNFT(
//         address player,
//         NVYGameLibrary.CaptainStats memory captain
//     ) external onlyRole(NVY_BACKEND) {
//         _tokenIds.increment();

//         uint256 newItemId = _tokenIds.current();

//         idToCaptains[newItemId] = captain;

//         _mint(player, newItemId);
//     }

//     function getCaptainInfo(uint256 captainId)
//         external
//         view
//         returns (NVYGameLibrary.CaptainStats memory)
//     {
//         return idToCaptains[captainId];
//     }

//     // ---------------------------------------
//     // Admin functions
//     // ---------------------------------------

//     function addNvyBackendAddress(address addr)
//         external
//         onlyRole(DEFAULT_ADMIN_ROLE)
//     {
//         require(
//             !hasRole(NVY_BACKEND, addr),
//             "Nvy backend address already added."
//         );
//         _grantRole(NVY_BACKEND, addr);
//     }

//     function removeNvyBackendAddr(address addr)
//         external
//         onlyRole(DEFAULT_ADMIN_ROLE)
//     {
//         require(
//             !hasRole(NVY_BACKEND, addr),
//             "Address is not a recognized NVY backend."
//         );
//         _revokeRole(NVY_BACKEND, addr);
//     }

//     // ---------------------------------------
//     // Misc
//     // ---------------------------------------

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721, AccessControl)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }
// }
