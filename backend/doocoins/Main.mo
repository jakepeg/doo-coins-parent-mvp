import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Types "./Types"

actor {
    stable var profiles : Types.Profile = Trie.empty();
    stable var childNumber : Nat = 1;
    //for keeping the child to tasks mapping
    stable var childToTasks : Types.TaskMap = Trie.empty();
    stable var childToTaskNumber: Trie.Trie<Text,Nat> = Trie.empty();

    //for keeping the child to transactions mapping
    stable var childToTransactions:Types.TransactionMap = Trie.empty();
    stable var childToTransactionNumber : Trie.Trie<Text,Nat> = Trie.empty();

    //for keeping the child to goals mapping
    stable var childToGoals : Types.GoalMap = Trie.empty();
    stable var childToGoalNumber : Trie.Trie<Text,Nat> = Trie.empty();

    //for setting up child's current goal
    stable var childToCurrentGoal:Trie.Trie<Text,Nat> = Trie.empty();

    //for mapping child's doocoins balance to child
    stable var childToBalance:Trie.Trie<Text,Nat> = Trie.empty(); 

    //creating a new child record
    //----------------------------------------------------------------------------------------------------
    public shared(msg) func addChild(child:Types.ChildCall):async Result.Result<Types.Child,Types.Error>{
        let callerId=msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let childId = Principal.toText(callerId) # "-" # Nat.toText(childNumber);
        childNumber +=1;
        let finalChild:Types.Child = {
            name = child.name;
            id = childId;
        };

        //Initializing task number to this child

        let (newChildToTaskNumber,existingTask)= Trie.put(
            childToTaskNumber,
            keyText(childId),
            Text.equal,
            1
        );
        childToTaskNumber := newChildToTaskNumber;

        let (childtobalancemap,existing) = Trie.put(
            childToBalance,
            keyText(childId),
            Text.equal,
            0
        );
        childToBalance:=childtobalancemap;

        //Initializing goal number to this child

        let (newChildToGoalNumber,existingGoal)= Trie.put(
            childToGoalNumber,
            keyText(childId),
            Text.equal,
            1
        );
        childToGoalNumber := newChildToGoalNumber;

        //Initializing transaction number to this child
        let (newChildToTransactionNumber,existingTransaction)= Trie.put(
            childToTransactionNumber,
            keyText(childId),
            Text.equal,
            1
        );
        childToTransactionNumber := newChildToTransactionNumber;

        let newProfiles = Trie.put2D(
            profiles,
            keyPrincipal(callerId),
            Principal.equal,
            keyText(childId),
            Text.equal,
            finalChild
        );
        profiles:=newProfiles;
        return #ok(finalChild);
    };

    //Add a task
    //Parametes needed: childId and Task (name and value)
    //----------------------------------------------------------------------------------------------------

    public shared(msg) func addTask(task:Types.TaskCall,childId:Text):async Result.Result<[Types.Task],Types.Error>{
        let callerId=msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        //Getting pointer of current task number of the child
        let currentTaskNumberPointer = Trie.find(
            childToTaskNumber,
            keyText(childId),
            Text.equal
        );
        
        let finalPointer:Nat = Option.get(currentTaskNumberPointer,0);
        let taskFinal:Types.Task ={
            name = task.name;
            value = task.value;
            id = finalPointer;
        } ;
        switch(finalPointer){
            case 0{
                #err(#NotFound);
            };
            case (v){
                let (newMap,existing) = Trie.put(
                    childToTaskNumber,
                    keyText(childId),
                    Text.equal,
                    finalPointer+1
                );

                childToTaskNumber:= newMap;

                let newChildToTasks=Trie.put2D(
                    childToTasks, 
                    keyText(childId),
                    Text.equal,
                    keyNat(finalPointer),
                    Nat.equal,
                    taskFinal
                );

                childToTasks:= newChildToTasks;
                
                let myChildTasks = Trie.find(
                    childToTasks,
                    keyText(childId),
                    Text.equal
                );
                let myChildTasksFormatted = Option.get(myChildTasks,Trie.empty());
                return #ok(Trie.toArray(myChildTasksFormatted,extractTasks));
                    };
                };
    };

    // Get all the children
    //
    //----------------------------------------------------------------------------------------------------
    
    public shared(msg) func getChildren():async Result.Result<[Types.Child],Types.Error>{
        let callerId=msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let allChildren = Trie.find(
            profiles,
            keyPrincipal(callerId),
            Principal.equal
        );

        let allChildrenFormatted = Option.get(allChildren,Trie.empty());
        return #ok(Trie.toArray(allChildrenFormatted,extractChildren));  
    };

    //Get the childs tasks
    //Parametes needed: childId
    //----------------------------------------------------------------------------------------------------

    public shared(msg) func getTasks(childId:Text):async Result.Result<[Types.Task],Types.Error>{
        let callerId = msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let myChildTasks = Trie.find(
            childToTasks,
            keyText(childId),
            Text.equal
        );
        let myChildTasksFormatted = Option.get(myChildTasks,Trie.empty());
        return #ok(Trie.toArray(myChildTasksFormatted,extractTasks));
    };

    //Add goal
    //Parametes needed: childId and Goal
    //----------------------------------------------------------------------------------------------------

    public shared(msg) func addGoal(goal:Types.GoalCall,childId:Text):async Result.Result<[Types.Goal],Types.Error>{
        let callerId=msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        //Getting pointer of current task number of the child
        let currentGoalNumberPointer = Trie.find(
            childToGoalNumber,
            keyText(childId),
            Text.equal
        );
        
        let finalPointer:Nat = Option.get(currentGoalNumberPointer,0);

        let finalGoalObject: Types.Goal= {
            name = goal.name;
            value = goal.value;
            id = finalPointer;
        };

        switch(finalPointer){
            case 0{
                #err(#NotFound);
            };
            case (v){
                let (newMap,existing) = Trie.put(
                    childToGoalNumber,
                    keyText(childId),
                    Text.equal,
                    finalPointer+1
                );

                childToGoalNumber:= newMap;

                let newChildToGoals=Trie.put2D(
                    childToGoals, 
                    keyText(childId),
                    Text.equal,
                    keyNat(finalPointer),
                    Nat.equal,
                    finalGoalObject
                );

                childToGoals:= newChildToGoals;
                let myChildGoals = Trie.find(
                    childToGoals,
                    keyText(childId),
                    Text.equal
                );
                let myChildGoalsFormatted = Option.get(myChildGoals,Trie.empty());
                return #ok(Trie.toArray(myChildGoalsFormatted,extractGoals));
                    };
                };
    };

    //Set the childs current goal
    //Parametes needed: childId and goalId
    //----------------------------------------------------------------------------------------------------

    public shared(msg) func currentGoal(childId:Text,goalId:Nat):async Result.Result<(),Types.Error>{
        let (updateChildToGoalNumber,existing) = Trie.put(
            childToCurrentGoal,
            keyText(childId),
            Text.equal,
            goalId
        );
        childToCurrentGoal:= updateChildToGoalNumber;
        return #ok(());
    };

    //Get childs transactions
    //
    //----------------------------------------------------------------------------------------------------

    public  func getTransactions(childId:Text):async Result.Result<[Types.Transaction],Types.Error>{
        let myChildTransactions = Trie.find(
            childToTransactions,
            keyText(childId),
            Text.equal
        );
        let myChildTransactionsFormatted = Option.get(myChildTransactions,Trie.empty());
        return #ok(Trie.toArray(myChildTransactionsFormatted,extractTransactions));
    };

    //Get childs goals
    //
    //----------------------------------------------------------------------------------------------------

    public  func getGoals(childId:Text):async Result.Result<[Types.Goal],Types.Error>{
        let myChildGoals = Trie.find(
            childToGoals,
            keyText(childId),
            Text.equal
        );
        let myChildGoalsFormatted = Option.get(myChildGoals,Trie.empty());
        return #ok(Trie.toArray(myChildGoalsFormatted,extractGoals));
    };
    
    //Approve a childs task
    //Parametes needed: childId and taskId
    //----------------------------------------------------------------------------------------------------

    public shared(msg) func approveTask(childId:Text,taskId:Nat,completedDate:Text):async Result.Result<(),Types.Error>{
        let callerId=msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let myChildTasks = Trie.find(
            childToTasks,
            keyText(childId),
            Text.equal
        );
        
        let myChildTasksFormatted:Trie.Trie<Nat,Types.Task> = Option.get(myChildTasks,Trie.empty());
        
        let targetTask = Trie.find(
            myChildTasksFormatted,
            keyNat(taskId),
            Nat.equal
        );
        switch(targetTask){
            case null{
                #err(#NotFound);
            };
            case (?v){
                let value:Nat = v.value;
                
                let (allTransactions,currentPointer)=returnTransactionDetails(childId);
                let transactionObject:Types.Transaction={
                    name=v.name;
                    value=value;
                    completedDate=completedDate;
                    transactionType="TASK_CREDIT";
                    id=currentPointer;
                };
                let newChildToTransactionMap = Trie.put2D(
                    childToTransactions,
                    keyText(childId),
                    Text.equal,
                    keyNat(currentPointer),
                    Nat.equal,
                    transactionObject
                );
                childToTransactions:=newChildToTransactionMap;
                let myBalance = await getBalance(childId);
                let currentBalanceFormatted = Nat.add(myBalance,value);
                let (updatedBalanceMap,existing) = Trie.put(
                    childToBalance,
                    keyText(childId),
                    Text.equal,
                    currentBalanceFormatted
                );
                childToBalance:= updatedBalanceMap;
                #ok(());
            };
        };
        
    
    };

    //Claim childs goal
    //Parametes needed: childId and goalId
    //----------------------------------------------------------------------------------------------------
    public shared(msg) func claimGoal(childId:Text,goalId:Nat,completedDate:Text):async Result.Result<(),Types.Error>{
        let callerId=msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let myGoals:?Trie.Trie<Nat,Types.Goal> = Trie.find(
            childToGoals,
            keyText(childId),
            Text.equal
        );
        
        let myChildGoalsFormatted:Trie.Trie<Nat,Types.Goal> = Option.get(myGoals,Trie.empty());
        
        let targetGoal = Trie.find(
            myChildGoalsFormatted,
            keyNat(goalId),
            Nat.equal
        );
        switch(targetGoal){
            case null{
                #err(#NotFound);
            };
            case (?v){
                let value:Nat = v.value;
                let myBalance = await getBalance(childId);
                if (value > myBalance){
                    return #err(#BalanceNotEnough);
                };
                let (allTransactions,currentPointer)=returnTransactionDetails(childId);
                let transactionObject:Types.Transaction={
                    name=v.name;
                    value=value;
                    completedDate=completedDate;
                    transactionType="GOAL_DEBIT";
                    id=currentPointer;
                };
                
                let newChildToTransactionMap = Trie.put2D(
                    childToTransactions,
                    keyText(childId),
                    Text.equal,
                    keyNat(currentPointer),
                    Nat.equal,
                    transactionObject
                );
                childToTransactions:=newChildToTransactionMap;
                
                let currentBalanceFormatted = Nat.sub(myBalance,value);
                let (updatedBalanceMap,existing) = Trie.put(
                    childToBalance,
                    keyText(childId),
                    Text.equal,
                    currentBalanceFormatted
                );
                childToBalance:= updatedBalanceMap;
                #ok(());
            };
        };
    };

    //Get childs current goal
    //Parametes needed: childId
    //----------------------------------------------------------------------------------------------------
    public func getCurrentGoal(childId:Text):async Nat{
        let currentGoalNumber = Trie.find(
            childToCurrentGoal,
            keyText(childId),
            Text.equal
        );
        let currentGoalNumberFormatted = Option.get(currentGoalNumber,0);
        return currentGoalNumberFormatted;
    };

    //Update childs task
    //Parametes needed: childId, taskNumber and updated task object
    //----------------------------------------------------------------------------------------------------
    public shared(msg) func updateTask(childId:Text,taskNumber:Nat,updatedTask:Types.Task):async Result.Result<(),Types.Error>{

        let callerId=msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let updatedChildToTasks = Trie.put2D(
            childToTasks,
            keyText(childId),
            Text.equal,
            keyNat(taskNumber),
            Nat.equal,
            updatedTask
        );
        childToTasks:=updatedChildToTasks;
        return #ok(());
    };

    //Update child
    //Parametes needed: childId and updated child object.
    //----------------------------------------------------------------------------------------------------
    public shared(msg) func updateChild(childId:Text,child:Types.Child):async Result.Result<(),Types.Error> {
        let callerId=msg.caller;

        // Reject AnonymousIdentity - 2vxsx-fae
        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let profilesUpdate = Trie.put2D(
            profiles,
            keyPrincipal(callerId),
            Principal.equal,
            keyText(childId),
            Text.equal,
            child
        );
        profiles:= profilesUpdate;
        return #ok(());
    };

    private func keyPrincipal(x:Principal):Trie.Key<Principal>{
        return {key = x;hash=Principal.hash(x)}
    };

    private func keyText(x:Text):Trie.Key<Text>{
        return {key = x;hash=Text.hash(x)}
    };

    private func keyNat(x:Nat):Trie.Key<Nat>{
        return {key = x;hash= Hash.hash(x)}
    };

    private func extractChildren(k:Text,v:Types.Child):Types.Child{
        return v;
    };

    private func extractTasks(k:Nat,v:Types.Task):Types.Task{
        return v;
    };
    private func extractTransactions(k:Nat,v:Types.Transaction):Types.Transaction{
        return v;
    };
    private func extractGoals(k:Nat,v:Types.Goal):Types.Goal{
        return v;
    };

    private func returnTransactionDetails(childId:Text):(Trie.Trie<Nat,Types.Transaction>,Nat){
        let myTransactions:?Trie.Trie<Nat,Types.Transaction> = Trie.find(
            childToTransactions,
            keyText(childId),
            Text.equal
        );
        
        let myTransactionsFormatted:Trie.Trie<Nat,Types.Transaction> = Option.get(myTransactions,Trie.empty());
        var currentPointer:Nat = Trie.size(myTransactionsFormatted);
        currentPointer+=1;
        return (myTransactionsFormatted,currentPointer);
    };

    public func getBalance(childId:Text):async Nat{
                let currentBalance = Trie.find(
                    childToBalance,
                    keyText(childId),
                    Text.equal
                );
                let currentBalanceFormatted = Option.get(currentBalance,0);
                return currentBalanceFormatted;
    }
}