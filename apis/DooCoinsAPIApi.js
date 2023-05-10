import * as React from 'react';
import {
  useQuery,
  useMutation,
  useIsFetching,
  useQueryClient,
} from 'react-query';
import useFetch from 'react-fetch-hook';
import { useIsFocused } from '@react-navigation/native';
import usePrevious from '../utils/usePrevious';
import * as GlobalVariables from '../config/GlobalVariableContext';
import {getBackendActor} from "../actor/actor.js"

export const addRewardPOSTStatusAndText = (
  Constants,
  { Child_ID, reward_name, reward_value }
) =>
  fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/rewards`, {
    body: JSON.stringify({
      name: reward_name,
      value: reward_value,
      children_id: Child_ID,
    }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const addRewardPOST = (
  Constants,
  { Child_ID, reward_name, reward_value }
) =>
  addRewardPOSTStatusAndText(Constants, {
    Child_ID,
    reward_name,
    reward_value,
  }).then(({ status, statusText, text }) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(
        [
          'Failed to parse response text as JSON.',
          `Error: ${e.message}`,
          `Text: ${JSON.stringify(text)}`,
        ].join('\n\n')
      );
    }
  });

export const useAddRewardPOST = initialArgs => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();

  return useMutation(
    args => addRewardPOST(Constants, { ...initialArgs, ...args }),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('rewards', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('reward');
        queryClient.invalidateQueries('rewards');
      },
    }
  );
};

export const FetchAddRewardPOST = ({
  children,
  onData = () => {},
  refetchInterval,
  Child_ID,
  reward_name,
  reward_value,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    loading,
    data,
    error,
    mutate: refetch,
  } = useAddRewardPOST(
    { Child_ID, reward_name, reward_value },
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchAddReward: refetch });
};

export const addTaskPOSTStatusAndText = async (
  Constants,
  { Child_ID, task_name, task_value }
) => {
console.log("in adding Tasks",typeof task_value)
const actor = await getBackendActor()
const addChild = await actor.addTask({value:Number(task_value),name:task_name},Child_ID)



return {
  status: "200",
  statusText: "",
  text: "",
}
}
 /* fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/tasks`, {
    body: JSON.stringify({
      name: task_name,
      value: task_value,
      children_id: Child_ID,
    }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));*/

export const addTaskPOST = (Constants, { Child_ID, task_name, task_value }) =>
  addTaskPOSTStatusAndText(Constants, { Child_ID, task_name, task_value }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useAddTaskPOST = initialArgs => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();

  return useMutation(
    args => addTaskPOST(Constants, { ...initialArgs, ...args }),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('tasks', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('task');
        queryClient.invalidateQueries('tasks');
      },
    }
  );
};

export const FetchAddTaskPOST = ({
  children,
  onData = () => {},
  refetchInterval,
  Child_ID,
  task_name,
  task_value,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    loading,
    data,
    error,
    mutate: refetch,
  } = useAddTaskPOST({ Child_ID, task_name, task_value }, { refetchInterval });

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchAddTask: refetch });
};

export const addTaskTransactionPOSTStatusAndText = (
  Constants,
  { Child_ID, plus_minus, transaction_name, transaction_value }
) =>
  fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/transactions`, {
    body: JSON.stringify({
      name: transaction_name,
      plus_minus: plus_minus,
      value: transaction_value,
      children_id: Child_ID,
    }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const addTaskTransactionPOST = (
  Constants,
  { Child_ID, plus_minus, transaction_name, transaction_value }
) =>
  addTaskTransactionPOSTStatusAndText(Constants, {
    Child_ID,
    plus_minus,
    transaction_name,
    transaction_value,
  }).then(({ status, statusText, text }) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(
        [
          'Failed to parse response text as JSON.',
          `Error: ${e.message}`,
          `Text: ${JSON.stringify(text)}`,
        ].join('\n\n')
      );
    }
  });

export const useAddTaskTransactionPOST = initialArgs => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();

  return useMutation(
    args => addTaskTransactionPOST(Constants, { ...initialArgs, ...args }),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('transactions', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('transaction');
        queryClient.invalidateQueries('transactions');
      },
    }
  );
};

export const FetchAddTaskTransactionPOST = ({
  children,
  onData = () => {},
  refetchInterval,
  Child_ID,
  plus_minus,
  transaction_name,
  transaction_value,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    loading,
    data,
    error,
    mutate: refetch,
  } = useAddTaskTransactionPOST(
    { Child_ID, plus_minus, transaction_name, transaction_value },
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchAddTaskTransaction: refetch });
};

export const addChildPOSTStatusAndText = async (
  Constants,
  { Parent_ID, new_child }
) =>{
  console.log("agentEntry1",getBackendActor())
  const actor = await getBackendActor()
  const addChild = await actor.addChild({name:new_child})
console.log("addChild",addChild)
return {
  status: "200",
  statusText: "",
  text: "",
}
}
  /*fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/children`, {
    body: JSON.stringify({
      name: new_child,
      parents_id: Parent_ID,
      balance: 0,
    }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));*/

export const addChildPOST = (Constants, { Parent_ID, new_child }) =>
  addChildPOSTStatusAndText(Constants, { Parent_ID, new_child }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useAddChildPOST = initialArgs => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();

  return useMutation(
    args => addChildPOST(Constants, { ...initialArgs, ...args }),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('children', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('child');
        queryClient.invalidateQueries('children');
      },
    }
  );
};

export const FetchAddChildPOST = ({
  children,
  onData = () => {},
  refetchInterval,
  Parent_ID,
  new_child,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    loading,
    data,
    error,
    mutate: refetch,
  } = useAddChildPOST({ Parent_ID, new_child }, { refetchInterval });

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchAddChild: refetch });
};

export const childListGETStatusAndText = async Constants  => {
  const actor = await getBackendActor()
  const children = await actor.getChildren()
  console.log("children from motoko",children)
  /*fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/children`, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));*/
}


export const childListGET = Constants =>
  childListGETStatusAndText(Constants).then(({ status, statusText, text }) => {
    try {
      console.log("child list",text)
      return JSON.parse(text);
    } catch (e) {
      console.error(
        [
          'Failed to parse response text as JSON.',
          `Error: ${e.message}`,
          `Text: ${JSON.stringify(text)}`,
        ].join('\n\n')
      );
    }
  });

export const useChildListGET = (args, { refetchInterval } = {}) => {
  const Constants = GlobalVariables.useValues();
  return useQuery(['children', args], () => childListGET(Constants, args), {
    refetchInterval,
  });
};

export const FetchChildListGET = ({
  children,
  onData = () => {},
  refetchInterval,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const { loading, data, error, refetch } = useChildListGET(
    {},
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchChildList: refetch });
};

export const getChildGETStatusAndText = (Constants, { children_id }) =>
  fetch(
    `https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/children/${
      children_id ?? ''
    }`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const getChildGET = (Constants, { children_id }) =>
  getChildGETStatusAndText(Constants, { children_id }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useGetChildGET = (args, { refetchInterval } = {}) => {
  const Constants = GlobalVariables.useValues();
  const queryClient = useQueryClient();
  return useQuery(['child', args], () => getChildGET(Constants, args), {
    refetchInterval,
    onSuccess: () => queryClient.invalidateQueries(['children']),
  });
};

export const FetchGetChildGET = ({
  children,
  onData = () => {},
  refetchInterval,
  children_id,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const { loading, data, error, refetch } = useGetChildGET(
    { children_id },
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchGetChild: refetch });
};

export const getChildrenGETStatusAndText = async (Constants, { Parent_ID }) => {
  const actor = await getBackendActor()
  const children = await actor.getChildren()
  console.log("children from motoko",children)
  return {text:children.ok,status:"200",statusText:"good"}
}
  /*fetch(
    `https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/childrenforparent2/${
      Parent_ID ?? ''
    }`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));*/

export const getChildrenGET = (Constants, { Parent_ID }) =>
  getChildrenGETStatusAndText(Constants, { Parent_ID }).then(
    ({ status, statusText, text }) => {
      try {
        console.log("child list in")
        return text;
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useGetChildrenGET = (args, { refetchInterval } = {}) => {
  const Constants = GlobalVariables.useValues();
  return useQuery(['children', args], () => getChildrenGET(Constants, args), {
    refetchInterval,
  });
};

export const FetchGetChildrenGET = ({
  children,
  onData = () => {},
  refetchInterval,
  Parent_ID,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const { loading, data, error, refetch } = useGetChildrenGET(
    { Parent_ID },
    { refetchInterval }
  );
      console.log("child data in FetchGetChildrenGet",data)
  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data['ok']);
    }
  }, [data]);

  return children({ loading, data, error, refetchGetChildren: refetch });
};

export const getGoalGETStatusAndText = (Constants, { rewards_id }) =>
  fetch(
    `https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/rewards/${
      rewards_id ?? ''
    }`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const getGoalGET = (Constants, { rewards_id }) =>
  getGoalGETStatusAndText(Constants, { rewards_id }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useGetGoalGET = (args, { refetchInterval } = {}) => {
  const Constants = GlobalVariables.useValues();
  const queryClient = useQueryClient();
  return useQuery(['reward', args], () => getGoalGET(Constants, args), {
    refetchInterval,
    onSuccess: () => queryClient.invalidateQueries(['rewards']),
  });
};

export const FetchGetGoalGET = ({
  children,
  onData = () => {},
  refetchInterval,
  rewards_id,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const { loading, data, error, refetch } = useGetGoalGET(
    { rewards_id },
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchGetGoal: refetch });
};

export const getRewardsGETStatusAndText = (Constants, { Child_ID }) =>
  fetch(
    `https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/getchildrewards/${
      Child_ID ?? ''
    }`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const getRewardsGET = (Constants, { Child_ID }) =>
  getRewardsGETStatusAndText(Constants, { Child_ID }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useGetRewardsGET = (args, { refetchInterval } = {}) => {
  const Constants = GlobalVariables.useValues();
  return useQuery(['rewards', args], () => getRewardsGET(Constants, args), {
    refetchInterval,
  });
};

export const FetchGetRewardsGET = ({
  children,
  onData = () => {},
  refetchInterval,
  Child_ID,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const { loading, data, error, refetch } = useGetRewardsGET(
    { Child_ID },
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchGetRewards: refetch });
};

export const getTasksGETStatusAndText = (Constants, { child_id }) =>
  fetch(
    `https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/getchildtasks/${
      child_id ?? ''
    }`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const getTasksGET = (Constants, { child_id }) =>
  getTasksGETStatusAndText(Constants, { child_id }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useGetTasksGET = (args, { refetchInterval } = {}) => {
  const Constants = GlobalVariables.useValues();
  return useQuery(['tasks', args], () => getTasksGET(Constants, args), {
    refetchInterval,
  });
};

export const FetchGetTasksGET = ({
  children,
  onData = () => {},
  refetchInterval,
  child_id,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const { loading, data, error, refetch } = useGetTasksGET(
    { child_id },
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchGetTasks: refetch });
};

export const getTransactionsGETStatusAndText = (Constants, { child_id }) =>
  fetch(
    `https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/getchildtransactions/${
      child_id ?? ''
    }`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  ).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const getTransactionsGET = (Constants, { child_id }) =>
  getTransactionsGETStatusAndText(Constants, { child_id }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useGetTransactionsGET = (args, { refetchInterval } = {}) => {
  const Constants = GlobalVariables.useValues();
  return useQuery(
    ['transactions', args],
    () => getTransactionsGET(Constants, args),
    {
      refetchInterval,
    }
  );
};

export const FetchGetTransactionsGET = ({
  children,
  onData = () => {},
  refetchInterval,
  child_id,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const { loading, data, error, refetch } = useGetTransactionsGET(
    { child_id },
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchGetTransactions: refetch });
};

export const getLoggedInUserGETStatusAndText = Constants =>
  fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: Constants['AUTHORIZATION_HEADER'],
      'Content-Type': 'application/json',
    },
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const getLoggedInUserGET = Constants =>
  getLoggedInUserGETStatusAndText(Constants).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useGetLoggedInUserGET = () => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();

  return useFetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/me`, {
    depends: [isFocused],
    headers: {
      Accept: 'application/json',
      Authorization: Constants['AUTHORIZATION_HEADER'],
      'Content-Type': 'application/json',
    },
  });
};

export const FetchGetLoggedInUserGET = ({
  children,
  onData = () => {},
  refetchInterval,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const refetch = () => {};
  const {
    isLoading: loading,
    data,
    error,
  } = useFetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/me`, {
    depends: [isFocused],
    headers: {
      Accept: 'application/json',
      Authorization: Constants['AUTHORIZATION_HEADER'],
      'Content-Type': 'application/json',
    },
  });

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchGetLoggedInUser: refetch });
};

export const loginPOSTStatusAndText = (
  Constants,
  { loginEmail, loginPassword }
) =>
  fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/login`, {
    body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const loginPOST = (Constants, { loginEmail, loginPassword }) =>
  loginPOSTStatusAndText(Constants, { loginEmail, loginPassword }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useLoginPOST = ({ loginEmail, loginPassword }) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();

  return useFetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/login`, {
    body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    depends: [isFocused],
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  });
};

export const FetchLoginPOST = ({
  children,
  onData = () => {},
  refetchInterval,
  loginEmail,
  loginPassword,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const refetch = () => {};
  const {
    isLoading: loading,
    data,
    error,
  } = useFetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/login`, {
    body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    depends: [isFocused],
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  });

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchLogin: refetch });
};

export const setGoalPOSTStatusAndText = (Constants, { Child_ID, Reward_ID }) =>
  fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/setgoal`, {
    body: JSON.stringify({ child_id: Child_ID, reward_id: Reward_ID }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const setGoalPOST = (Constants, { Child_ID, Reward_ID }) =>
  setGoalPOSTStatusAndText(Constants, { Child_ID, Reward_ID }).then(
    ({ status, statusText, text }) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error(
          [
            'Failed to parse response text as JSON.',
            `Error: ${e.message}`,
            `Text: ${JSON.stringify(text)}`,
          ].join('\n\n')
        );
      }
    }
  );

export const useSetGoalPOST = initialArgs => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();

  return useMutation(
    args => setGoalPOST(Constants, { ...initialArgs, ...args }),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('children', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('child');
        queryClient.invalidateQueries('children');
      },
    }
  );
};

export const FetchSetGoalPOST = ({
  children,
  onData = () => {},
  refetchInterval,
  Child_ID,
  Reward_ID,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    loading,
    data,
    error,
    mutate: refetch,
  } = useSetGoalPOST({ Child_ID, Reward_ID }, { refetchInterval });

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchSetGoal: refetch });
};

export const signUpPOSTStatusAndText = (
  Constants,
  { signupEmail, signupName, signupPassword }
) =>
  fetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/signup`, {
    body: JSON.stringify({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  }).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const signUpPOST = (
  Constants,
  { signupEmail, signupName, signupPassword }
) =>
  signUpPOSTStatusAndText(Constants, {
    signupEmail,
    signupName,
    signupPassword,
  }).then(({ status, statusText, text }) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(
        [
          'Failed to parse response text as JSON.',
          `Error: ${e.message}`,
          `Text: ${JSON.stringify(text)}`,
        ].join('\n\n')
      );
    }
  });

export const useSignUpPOST = ({ signupEmail, signupName, signupPassword }) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();

  return useFetch(
    `https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/signup`,
    {
      body: JSON.stringify({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      }),
      depends: [isFocused],
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  );
};

export const FetchSignUpPOST = ({
  children,
  onData = () => {},
  refetchInterval,
  signupEmail,
  signupName,
  signupPassword,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const refetch = () => {};
  const {
    isLoading: loading,
    data,
    error,
  } = useFetch(`https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/auth/signup`, {
    body: JSON.stringify({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
    }),
    depends: [isFocused],
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    method: 'POST',
  });

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchSignUp: refetch });
};

export const updateChildBalancePOSTStatusAndText = (
  Constants,
  {
    Child_ID,
    Parent_ID,
    Selected_Child_Balance,
    Selected_Child_Name,
    Selected_Child_Reward,
    children_id,
  }
) =>
  fetch(
    `https://x8ki-letl-twmt.n7.xano.io/api:21fB7LVM/children/${
      children_id ?? ''
    }`,
    {
      body: JSON.stringify({
        children_id: Child_ID,
        name: Selected_Child_Name,
        parents_id: Parent_ID,
        rewards_id: Selected_Child_Reward,
        balance: Selected_Child_Balance,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  ).then(async res => ({
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
  }));

export const updateChildBalancePOST = (
  Constants,
  {
    Child_ID,
    Parent_ID,
    Selected_Child_Balance,
    Selected_Child_Name,
    Selected_Child_Reward,
    children_id,
  }
) =>
  updateChildBalancePOSTStatusAndText(Constants, {
    Child_ID,
    Parent_ID,
    Selected_Child_Balance,
    Selected_Child_Name,
    Selected_Child_Reward,
    children_id,
  }).then(({ status, statusText, text }) => {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(
        [
          'Failed to parse response text as JSON.',
          `Error: ${e.message}`,
          `Text: ${JSON.stringify(text)}`,
        ].join('\n\n')
      );
    }
  });

export const useUpdateChildBalancePOST = initialArgs => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();

  return useMutation(
    args => updateChildBalancePOST(Constants, { ...initialArgs, ...args }),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('children', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('child');
        queryClient.invalidateQueries('children');
      },
    }
  );
};

export const FetchUpdateChildBalancePOST = ({
  children,
  onData = () => {},
  refetchInterval,
  Child_ID,
  Parent_ID,
  Selected_Child_Balance,
  Selected_Child_Name,
  Selected_Child_Reward,
  children_id,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    loading,
    data,
    error,
    mutate: refetch,
  } = useUpdateChildBalancePOST(
    {
      Child_ID,
      Parent_ID,
      Selected_Child_Balance,
      Selected_Child_Name,
      Selected_Child_Reward,
      children_id,
    },
    { refetchInterval }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  React.useEffect(() => {
    if (data) {
      onData(data);
    }
  }, [data]);

  return children({ loading, data, error, refetchUpdateChildBalance: refetch });
};
