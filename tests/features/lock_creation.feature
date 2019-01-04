Feature: Lock Creation

   Creators can create Locks

   Scenario: Creator successfully creates a lock
   Given creator is on the dashboard
   When the creator has Eth available
   And has tapped create lock
   And has filled out lock details
   And submitted their request
   Then the lock is created