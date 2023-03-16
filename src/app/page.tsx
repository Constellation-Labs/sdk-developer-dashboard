import { ClusterMetrics } from '@/components/ClusterMetrics'
import { LatestSnapshot } from '@/components/LatestSnapshot'
import { Snapshots } from '@/components/Snapshots'
import { TotalSupply } from '@/components/TotalSupply'
import { WalletBalance } from '@/components/WalletBalance'

export const metadata = {
  title: 'Dashboard',
  description: 'Main Dashboard',
}

export default async function Home() {
  if (
    !process.env.L1_CURRENCY_URL ||
    !process.env.L0_CURRENCY_URL ||
    !process.env.L0_GLOBAL_URL
  ) {
    return (
      <h1 className="text-3xl font-bold underline">
        You should provide the: L0_CURRENCY_URL, L1_CURRENCY_URL, and
        L0_GLOBAL_URL as env variables
      </h1>
    )
  }

  return (
    <div className="w-full h-full px-6 pb-4 bg-background-light dark:bg-background-dark">
      <section className="mt-6 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        <ClusterMetrics
          apiUrl={process.env.L0_GLOBAL_URL}
          clusterName="L0 Global"
        />
        <ClusterMetrics
          apiUrl={process.env.L0_CURRENCY_URL}
          clusterName="L0 Currency"
        />
        <ClusterMetrics
          apiUrl={process.env.L1_CURRENCY_URL}
          clusterName="L1 Currency"
        />
      </section>

      <section className="mt-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
        <LatestSnapshot
          apiUrl={process.env.L0_GLOBAL_URL}
          clusterName="L0 Global"
          isGlobalSnapshot
        />
        <TotalSupply
          apiUrl={process.env.L0_GLOBAL_URL}
          clusterName="L0 Global"
          isGlobalSnapshot
        />

        <LatestSnapshot
          apiUrl={process.env.L0_CURRENCY_URL}
          clusterName="L0 Currency"
        />
        <TotalSupply
          apiUrl={process.env.L0_CURRENCY_URL}
          clusterName="L0 Currency"
        />
      </section>

      <section className="my-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-2">
        <Snapshots clusterName="L0 Global" isGlobalSnapshot />

        <Snapshots clusterName="L0 Currency" />
      </section>

      <section className="my-2 grid w-full grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-2">
        <WalletBalance
          apiUrl={process.env.L0_GLOBAL_URL}
          clusterName="L0 Global"
          isGlobalSnapshot
        />

        <WalletBalance
          apiUrl={process.env.L0_CURRENCY_URL}
          clusterName="L0 Currency"
        />
      </section>
    </div>
  )
}
