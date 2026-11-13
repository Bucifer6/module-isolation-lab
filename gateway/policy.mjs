export function chooseModel({dataClass, allowExternal = false, localReady = true, externalReady = true, budgetRemaining = 0}) {
  if (dataClass === 'restricted' && !allowExternal) {
    return localReady ? {provider:'local'} : {provider:null,reason:'local_unavailable'};
  }
  if (localReady) return {provider:'local'};
  if (allowExternal && externalReady && budgetRemaining > 0) return {provider:'external'};
  return {provider:null,reason:'no_permitted_provider'};
}
