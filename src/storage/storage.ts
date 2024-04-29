import { Environment } from "../model/Environment"

export async function getEnvironments(): Promise<Environment[]> {
    return ((await chrome.storage.local.get(["environments"])).environments || []).map(Environment.fromObject)
}

export async function saveEnvironments(environments: Environment[]) {
    const data = environments.map((environment: Environment) => {
        return {
            pattern: environment.pattern,
            type: environment.type,
        }
    })

    await chrome.storage.local.set({ environments: data })
}

export async function setIsExtensionEnabled(enabled: boolean): Promise<void> {
    await chrome.storage.local.set({ enabled: enabled })
}

export async function isExtensionEnabled(): Promise<boolean> {
    const enabled = (await chrome.storage.local.get(["enabled"])).enabled

    if (enabled === undefined) {
        return true
    }

    return enabled
}
