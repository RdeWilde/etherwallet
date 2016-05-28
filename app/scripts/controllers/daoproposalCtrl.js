'use strict';
var theDaoCtrl = function($scope, $sce, walletService) {
	$scope.curTab = "send";
	new Modal(document.getElementById('sendTransaction'));
    $scope.voteModal = new Modal(document.getElementById('voteProposal'));
	walletService.wallet = null;
	walletService.password = '';
	$scope.showAdvance = false;
	$scope.showRaw = false;
	$scope.slockitContract = "0xd838f9c9792bf8398e1f5fbfbd3b43c5a86445aa"; // 0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413
	$scope.slockitBalance = "0x70a08231";
	$scope.slockitSupply = "0x18160ddd";
	$scope.slockitTransfer = "0xa9059cbb";
	$scope.slockitProposal = "0x013cf08b";
	$scope.slockitminQuorumDivisor = "0x674ed066";
	$scope.slockitABalance = "0x39d1f908";
	$scope.slockitRToken = "0xcdef91d0";
    $scope.slockitVote = "0xc9d27afe";
	$scope.tx = {
		gasLimit: 150000,
		data: '',
		to: $scope.slockitContract,
		unit: "ether",
		value: 0,
		nonce: null,
		gasPrice: null,
		donate: false
	}
	$scope.token = {
		balance: 0,
		total: 0,
		totRaised: 0
	}
	$scope.tokenTx = {
		to: '',
		value: 0,
		unit: "dao"
	}
	$scope.$watch(function() {
		if (walletService.wallet == null) return null;
		return walletService.wallet.getAddressString();
	}, function() {
		if (walletService.wallet == null) return;
		$scope.wallet = walletService.wallet;
		$scope.setBalance();
	});
	$scope.setBalance = function() {
		ajaxReq.getBalance($scope.wallet.getAddressString(), function(data) {
			if (data.error) {
				$scope.etherBalance = data.msg;
			} else {
				$scope.etherBalance = etherUnits.toEther(data.data.balance, 'wei');
				ajaxReq.getETHvalue(function(data) {
					$scope.usdBalance = etherUnits.toFiat($scope.etherBalance, 'ether', data.usd);
					$scope.eurBalance = etherUnits.toFiat($scope.etherBalance, 'ether', data.eur);
					$scope.btcBalance = etherUnits.toFiat($scope.etherBalance, 'ether', data.btc);
				});
			}
		});
		var userInfo = ethFuncs.getDataObj($scope.slockitContract, $scope.slockitBalance, [ethFuncs.getNakedAddress($scope.wallet.getAddressString())]);
		ajaxReq.getEthCall(userInfo, function(data) {
			if (data.error) {
				$scope.etherBalance = data.msg;
			} else {
				$scope.token.balance = new BigNumber(data.data).div(etherUnits.getValueOfUnit('milli') * 10).toString();
			}
		});
		var totSupply = ethFuncs.getDataObj($scope.slockitContract, $scope.slockitSupply, []);
		ajaxReq.getEthCall(totSupply, function(data) {
			if (data.error) {
				$scope.etherBalance = data.msg;
			} else {
				$scope.token.total = new BigNumber(data.data).toString();
			}
		});
		ajaxReq.getBalance($scope.slockitContract, function(data) {
			if (data.error) {
				$scope.etherBalance = data.msg;
			} else {
				$scope.token.totRaised = etherUnits.toEther(data.data.balance, 'wei');
			}
		});
		var minq = ethFuncs.getDataObj($scope.slockitContract, $scope.slockitminQuorumDivisor, []);
		ajaxReq.getEthCall(minq, function(data) {
			if (data.error) {
				$scope.etherBalance = data.msg;
			} else {
				$scope.minQuorumDivisor = new BigNumber(data.data).toNumber();
			}
		});
		var actB = ethFuncs.getDataObj($scope.slockitContract, $scope.slockitABalance, []);
		ajaxReq.getEthCall(actB, function(data) {
			if (data.error) {
				$scope.etherBalance = data.msg;
			} else {
				$scope.actualBalance = new BigNumber(data.data).toNumber();
			}
		});
		var rToken = ethFuncs.getDataObj($scope.slockitContract, $scope.slockitRToken, [ethFuncs.getNakedAddress($scope.wallet.getAddressString())]);
		ajaxReq.getEthCall(rToken, function(data) {
			if (data.error) {
				$scope.etherBalance = data.msg;
			} else {
				$scope.rewardToken = new BigNumber(data.data).toNumber();
			}
		});
	}
	$scope.generateTokenTx = function() {
		try {
			if (!ethFuncs.validateEtherAddress($scope.tokenTx.to)) throw globalFuncs.errorMsgs[5];
			else if (!globalFuncs.isNumeric($scope.tokenTx.value) || parseFloat($scope.tokenTx.value) < 0) throw globalFuncs.errorMsgs[7];
			$scope.tx.to = $scope.slockitContract;
			var value = ethFuncs.padLeft(new BigNumber($scope.tokenTx.value).times(etherUnits.getValueOfUnit('milli') * 10).toString(16), 64);
			var toAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress($scope.tokenTx.to), 64);
			$scope.tx.data = $scope.slockitTransfer + toAdd + value;
			$scope.tx.value = 0;
			$scope.validateTxStatus = $sce.trustAsHtml(globalFuncs.getDangerText(''));
			$scope.generateTx();
		} catch (e) {
			$scope.showRaw = false;
			$scope.validateTxStatus = $sce.trustAsHtml(globalFuncs.getDangerText(e));
		}
	}
    $scope.generateVoteTx = function(isYes) {
        $scope.voteTxStatus = true;
		try {
			$scope.tx.to = $scope.slockitContract;
			var id = ethFuncs.padLeft(new BigNumber($scope.proposalId).toString(16), 64);
			var vote = isYes ? ethFuncs.padLeft("1", 64) : ethFuncs.padLeft("0", 64);
			$scope.tx.data = $scope.slockitVote + id + vote;
			$scope.tx.value = 0;
			$scope.voteTxStatus = $sce.trustAsHtml(globalFuncs.getDangerText(''));
            $scope.autoSend = true;
			$scope.generateTx();
		} catch (e) {
			$scope.showRaw = false;
			$scope.voteTxStatus = $sce.trustAsHtml(globalFuncs.getDangerText(e));
		}
        $scope.voteModal.close();
	}
	$scope.setProposal = function() {
		try {
			$scope.loadProposalStatus = "";
			if (!globalFuncs.isNumeric($scope.proposalId) || parseFloat($scope.proposalId) < 0) throw globalFuncs.errorMsgs[15];
			var callProposal = ethFuncs.getDataObj($scope.slockitContract, $scope.slockitProposal, [$scope.proposalId]);
			ajaxReq.getEthCall(callProposal, function(data) {
				try {
					if (data.error) {
						$scope.loadProposalStatus = data.msg;
					} else {
						var proposal = ethFuncs.contractOutToArray(data.data);
						$scope.objProposal = {
							id: $scope.proposalId,
							recipient: '0x' + proposal[0],
							amount: etherUnits.toEther('0x' + proposal[1], 'wei'),
							content: proposal.slice(13).join(),
							description: globalFuncs.hexToAscii(proposal.slice(13).join('')).replace(/<br>/g, '\n').replace(/\\n/g, '\n'),
							votingDeadline: new Date(new BigNumber("0x" + proposal[3]).toNumber() * 1000),
                            today: new Date(),
							open: proposal[4] == '1' ? "Yes" : "No",
							proposalPassed: proposal[5] == '1' ? "Yes" : "No",
							proposalHash: '0x'+proposal[6],
							proposalDeposit: etherUnits.toEther('0x' + proposal[7], 'wei'),
							split: proposal[8] == '1' ? "Yes" : "No",
							yea: etherUnits.toEther('0x' + proposal[9], 'wei'),
							nay: etherUnits.toEther('0x' + proposal[10], 'wei'),
							creator: "0x" + proposal[11],
							enabled: true,
							minQuroum: function() {
								var totalInWei = etherUnits.toWei($scope.token.totRaised, "ether");
								return etherUnits.toEther(totalInWei / $scope.minQuorumDivisor + (etherUnits.toWei(this.amount, "ether") * totalInWei) / (3 * ($scope.actualBalance + $scope.rewardToken)), "wei");
							},
							data: proposal
						};
						var yeaBN = new BigNumber($scope.objProposal.yea);
						var nayBN = new BigNumber($scope.objProposal.nay);
						$scope.objProposal.totalVotes = yeaBN.plus(nayBN)
						$scope.objProposal.yeaPer = yeaBN.plus(nayBN).toNumber()=='0' ? 0 : yeaBN.div( $scope.objProposal.totalVotes ).times(100).toNumber();
						$scope.objProposal.nayPer = yeaBN.plus(nayBN).toNumber()=='0' ? 0 : nayBN.div( $scope.objProposal.totalVotes ).times(100).toNumber();
            $scope.showProposal = true;
						$scope.objProposal.quorumCurrent = ( $scope.objProposal.totalVotes *100 ) / $scope.token.totRaised;
						$scope.objProposal.quorumPer = ( $scope.objProposal.minQuroum()*100 ) / $scope.token.totRaised;

					}
				} catch (e) {
					$scope.loadProposalStatus = $sce.trustAsHtml(globalFuncs.errorMsgs[15]);
					$scope.showProposal = false;
				}
			});
		} catch (e) {
			$scope.loadProposalStatus = $sce.trustAsHtml(globalFuncs.getDangerText(e));
		}
	}
	$scope.$watch('curTab', function() {
		$scope.tx.data = '';
		$scope.showRaw = $scope.showProposal = false;
	});
	$scope.$watch('[tx,curTab]', function() {
		$scope.showRaw = false;
		$scope.sendTxStatus = "";
	}, true);
	$scope.generateTx = function() {
		uiFuncs.generateTx($scope, $sce);
	}
	$scope.sendTx = function() {
		uiFuncs.sendTx($scope, $sce);
	}
};
module.exports = theDaoCtrl;
