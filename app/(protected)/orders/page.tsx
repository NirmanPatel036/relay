'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, CreditCard, Truck, Calendar, MapPin, DollarSign, FileText, AlertCircle, CheckCircle, Clock, XCircle, Loader2, Copy, Check, Info, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface Order {
  id: string
  order_number: string
  user_id: string
  status: string
  items: any
  total_amount: number
  shipping_address: any
  tracking_number: string | null
  carrier: string | null
  estimated_delivery: string | null
  actual_delivery: string | null
  created_at: string
  updated_at: string
  users?: {
    name: string
    email: string
  }
}

interface Payment {
  id: string
  invoice_number: string
  user_id: string
  amount: number
  status: string
  payment_method: string
  transaction_id: string | null
  description: string | null
  invoice_date: string
  due_date: string | null
  paid_date: string | null
  refund_amount: number | null
  refund_date: string | null
  refund_reason: string | null
  created_at: string
  users?: {
    name: string
    email: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [rlsError, setRlsError] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch ALL orders with user information (seeded demo data)
      // This bypasses user filtering to show all demo data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, users(name, email)')
        .order('created_at', { ascending: false })

      console.log('Orders fetched:', ordersData?.length, ordersData)
      if (ordersError) {
        console.error('Orders error:', ordersError)
        // Check if it's an RLS issue
        if (ordersError.message?.includes('policy') || ordersError.code === 'PGRST116') {
          setRlsError(true)
        }
      }

      // Fetch ALL payments with user information (seeded demo data)
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*, users(name, email)')
        .order('created_at', { ascending: false })

      console.log('Payments fetched:', paymentsData?.length, paymentsData)
      if (paymentsError) {
        console.error('Payments error:', paymentsError)
        if (paymentsError.message?.includes('policy') || paymentsError.code === 'PGRST116') {
          setRlsError(true)
        }
      }

      setOrders(ordersData || [])
      setPayments(paymentsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'refunded':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      delivered: 'bg-green-500/20 text-green-600 border-green-500/30',
      shipped: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
      processing: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
      cancelled: 'bg-red-500/20 text-red-600 border-red-500/30',
      paid: 'bg-green-500/20 text-green-600 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
      refunded: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status.toLowerCase()] || 'bg-gray-500/20 text-gray-600 border-gray-500/30'}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {rlsError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Row Level Security (RLS) Policy Issue</p>
              <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                Supabase RLS policies are blocking access to all orders/payments. For demo purposes, you need to update the RLS policies.
              </p>
              <div className="bg-red-500/10 rounded p-2 font-mono text-xs">
                <p className="mb-1">Go to Supabase Dashboard → Authentication → Policies</p>
                <p>Add policies for <code>orders</code> and <code>payments</code> tables:</p>
                <p className="mt-1">SELECT: <code>true</code> (allow all authenticated users to read)</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Demo Orders & Invoices</h1>
          <p className="text-muted-foreground">View seeded demo data with realistic orders and invoices. Copy order/invoice numbers to query in the chat.</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg border border-primary/20 transition-all disabled:opacity-50"
          title="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-mono">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Demo Data Info Banner */}
      {(orders.length > 0 || payments.length > 0) && (
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                <span className="font-semibold">Demo Mode:</span> Showing {orders.length > 0 ? `all ${orders.length} seeded orders` : 'no orders'} 
                {payments.length > 0 ? ` and ${payments.length} invoices` : ' and no invoices'} for testing the multi-agent chat system. 
                Copy any order number (e.g., <code className="px-1 py-0.5 bg-blue-500/20 rounded font-mono text-xs">ORD-2026-1001</code>) or invoice number 
                (e.g., <code className="px-1 py-0.5 bg-blue-500/20 rounded font-mono text-xs">INV-2026-1001</code>) and paste it in the chat to query details, 
                track shipments, or check refund status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-semibold transition-all relative ${
            activeTab === 'orders'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Orders ({orders.length})
          </div>
          {activeTab === 'orders' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 px-4 font-semibold transition-all relative ${
            activeTab === 'invoices'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Invoices ({payments.length})
          </div>
          {activeTab === 'invoices' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">No orders found</p>
              <p className="text-sm text-muted-foreground">No order data available at the moment</p>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono font-bold text-lg">{order.order_number}</h3>
                        <button
                          onClick={() => copyToClipboard(order.order_number, order.id)}
                          className="p-1 hover:bg-accent rounded transition-all"
                          title="Copy order number"
                        >
                          {copiedId === order.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.users?.name} • Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Items */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Package className="w-4 h-4" />
                      Items
                    </div>
                    <div className="text-sm text-muted-foreground pl-6">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx}>{item.name} - {item.quantity}x</div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </div>
                    <div className="text-sm text-muted-foreground pl-6">
                      {order.shipping_address.street}<br />
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  {/* Total Amount */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <span className="font-bold">{formatCurrency(order.total_amount)}</span>
                  </div>

                  {/* Tracking */}
                  {order.tracking_number && (
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tracking:</span>
                      <span className="font-mono text-sm">{order.tracking_number}</span>
                    </div>
                  )}

                  {/* Delivery Date */}
                  {(order.estimated_delivery || order.actual_delivery) && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {order.actual_delivery ? 'Delivered:' : 'Est. Delivery:'}
                      </span>
                      <span className="text-sm">
                        {formatDate((order.actual_delivery || order.estimated_delivery)!)}
                      </span>
                    </div>
                  )}
                </div>

                {order.carrier && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Carrier: <span className="font-semibold">{order.carrier}</span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {payments.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">No invoices found</p>
              <p className="text-sm text-muted-foreground">No invoice data available at the moment</p>
            </div>
          ) : (
            payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono font-bold text-lg">{payment.invoice_number}</h3>
                        <button
                          onClick={() => copyToClipboard(payment.invoice_number, payment.id)}
                          className="p-1 hover:bg-accent rounded transition-all"
                          title="Copy invoice number"
                        >
                          {copiedId === payment.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {payment.users?.name} • Issued on {formatDate(payment.invoice_date)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>

                {payment.description && (
                  <div className="mb-4 text-sm text-muted-foreground">
                    {payment.description}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Amount */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </div>
                    <div className="text-2xl font-bold pl-6">
                      {formatCurrency(payment.amount)}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CreditCard className="w-4 h-4" />
                      Payment Method
                    </div>
                    <div className="text-sm pl-6">
                      {payment.payment_method}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  {/* Transaction ID */}
                  {payment.transaction_id && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Transaction ID</span>
                      <span className="font-mono text-sm">{payment.transaction_id}</span>
                    </div>
                  )}

                  {/* Paid Date */}
                  {payment.paid_date && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Paid On</span>
                      <span className="text-sm">{formatDate(payment.paid_date)}</span>
                    </div>
                  )}

                  {/* Due Date */}
                  {payment.due_date && !payment.paid_date && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Due Date</span>
                      <span className="text-sm">{formatDate(payment.due_date)}</span>
                    </div>
                  )}
                </div>

                {/* Refund Information */}
                {payment.refund_amount && (
                  <div className="mt-4 pt-4 border-t border-border bg-orange-500/10 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="font-semibold text-sm">Refund Information</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Refund Amount:</span>{' '}
                        <span className="font-bold">{formatCurrency(payment.refund_amount)}</span>
                      </div>
                      {payment.refund_date && (
                        <div>
                          <span className="text-muted-foreground">Refund Date:</span>{' '}
                          <span>{formatDate(payment.refund_date)}</span>
                        </div>
                      )}
                    </div>
                    {payment.refund_reason && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Reason:</span>{' '}
                        <span>{payment.refund_reason}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
