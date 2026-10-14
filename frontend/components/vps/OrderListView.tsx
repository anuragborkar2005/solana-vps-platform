"use client";

import React, { useState } from "react";
import { Plus, Server, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VPSOrder, OrderStatus } from "@/types/vps";
import { lamportsToSol, shortenAddress } from "@/lib/mock-api";
import { DEMO_WALLET_PUBKEY } from "@/lib/demo-wallet";

interface OrderListViewProps {
  orders: VPSOrder[];
  walletAddress: string | null;
  onSelectOrder: (orderId: string) => void;
  onOpenCreateModal: () => void;
}

export function OrderListView({
  orders,
  walletAddress,
  onSelectOrder,
  onOpenCreateModal,
}: OrderListViewProps) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredOrders = orders.filter((o) => {
    if (filter === "ALL") return true;
    return o.status === filter;
  });

  const countByStatus = (status: string) => {
    if (status === "ALL") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <section className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Your VPS Deployments
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage and inspect all virtual cloud servers ordered by your Solana wallet.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button
            onClick={onOpenCreateModal}
            className="w-full sm:w-auto px-4 py-2.5 h-10 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-semibold text-xs transition flex items-center justify-center space-x-2 border-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New VPS</span>
          </Button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 rounded-lg p-1 font-medium">
          {[
            { id: "ALL", label: "All" },
            { id: "ACTIVE", label: "Active" },
            { id: "PAYMENT_PENDING", label: "Pending" },
            { id: "PROVISIONING", label: "Provisioning" },
            { id: "PROVISIONING_FAILED", label: "Failed" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1 rounded-md transition cursor-pointer ${
                filter === item.id
                  ? "bg-zinc-800 text-white font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {item.label} ({countByStatus(item.id)})
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Owner:{" "}
          <span className="text-zinc-200">
            {shortenAddress(walletAddress || DEMO_WALLET_PUBKEY)}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Instance Name</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">IP Address</th>
                <th className="py-3.5 px-4 font-semibold">Specs</th>
                <th className="py-3.5 px-4 font-semibold">Cost</th>
                <th className="py-3.5 px-4 font-semibold">Expires / Paid Until</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center space-y-3 font-mono"
                  >
                    <Server className="w-8 h-8 text-zinc-600 mx-auto" />
                    <div className="text-zinc-300 font-medium text-sm">No VPS Deployments Found</div>
                    <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                      {filter === "ALL"
                        ? "This wallet does not have any active or pending server orders yet. Deploy your first autonomous Linux node in under 1 second."
                        : `No orders found matching filter "${filter}".`}
                    </p>
                    <div className="pt-2">
                      <Button
                        onClick={onOpenCreateModal}
                        className="bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs px-4 py-2 h-9 rounded-xl shadow-md border-0 cursor-pointer"
                      >
                        Deploy New VPS Instance
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.order_id}
                    onClick={() => onSelectOrder(order.order_id)}
                    className="hover:bg-zinc-900/50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <Server className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                        <span>{order.name}</span>
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {order.order_id}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-mono border badge-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      {order.host ? (
                        <span>{order.host}</span>
                      ) : (
                        <span className="text-zinc-600">Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">2 vCPU / 4GB</td>
                    <td className="py-3.5 px-4 text-zinc-200 font-bold">
                      {lamportsToSol(order.price_lamports)}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {order.paid_until
                        ? new Date(order.paid_until).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order.order_id);
                        }}
                        variant="outline"
                        size="sm"
                        className="px-2.5 py-1 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs border-zinc-700"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
