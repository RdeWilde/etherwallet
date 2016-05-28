<!-- The DAO Proposals -->
<div class="tab-pane active" ng-if="globalService.currentTab==globalService.tabs.daoproposals.id">

  <section class="row">
    <div class="col-xs-12">
      <h2> Browse DAO Proposals </h2>
      <p><a ng-click="globalService.currentTab=globalService.tabs.dao.id">If you would like to Send DAO Tokens, please click here.</a> Learn more at <a href="http://daohub.org/" target="_blank">DAOHub</a>, <a href="https://blog.slock.it/the-art-of-the-dao-experiments-with-the-generic-dao-framework-4782f7862131#.bibozinlb" target="_blank">The Art of the DAO</a>, and <a href="https://forum.daohub.org/c/theDAO" target="_blank">DAO Hub Forums (Support, too!)</a></p>
    </div>
  </section>

  <section class="row" style="margin-bottom: 10px;" ng-controller='theDaoProposalCtrl'>
    <div class="col-xs-12">
      <h4> Show.... </h4>
      <div class="bg-primary">
        <a href="#" class="proposal-filter active">All Proposals</a>
        <a href="#" class="proposal-filter">Current Proposals</a>
        <a href="#" class="proposal-filter">Previous Proposals</a>
        <a href="#" class="proposal-filter">Non-Split Proposals</a>
        <a href="#" class="proposal-filter">Split Proposals</a>
      </div>
    </div>
  </section>

  <div class="proposal-container">

    <dao-proposal-drtv></dao-proposal-drtv>


  </div>


  <!-- Vote Modal -->
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="sendTransactionLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h3 class="modal-title" id="myModalLabel">Unlock your Wallet to Vote on Proposal #1</h3>
        </div>
        <div class="modal-body">
          <div>
            @@if (site === 'cx' ) {
              <cx-wallet-decrypt-drtv></cx-wallet-decrypt-drtv>
            }
            @@if (site === 'mew' ) {
              <wallet-decrypt-drtv></wallet-decrypt-drtv>
            }
          </div>
          <hr />
          <h4>You are about to vote on Proposal <strong>#1</strong>: DAO Support Proposal.</h4>
          <h4 class="text-light">Please vote carefully, there are no do-overs or take-backs.</h4>

          <div class="row">
            <div class="col-sm-4 marg-v-md">
              <button type="button" class="btn btn-block btn-danger" ng-click="sendTx()">VOTE NO</button>
            </div>
            <div class="col-sm-4 marg-v-md">
              <button type="button" class="btn btn-block btn-default" data-dismiss="modal">GET ME OUT OF HERE</button>
            </div>
            <div class="col-sm-4 marg-v-md">
              <button type="button" class="btn btn-block btn-primary" ng-click="sendTx()">VOTE YES</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- / Vote Modal -->



</div>
<!-- / The DAO Proposals -->





