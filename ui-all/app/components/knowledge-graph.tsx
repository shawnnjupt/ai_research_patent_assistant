"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null)

  // 添加 reRender 函数，用于重新绘制知识图谱
  const reRender = () => {
    if (svgRef.current) {
      // 清除现有的 SVG 内容
      d3.select(svgRef.current).selectAll("*").remove()

      // 重新触发 useEffect 中的逻辑
      fetch('/api/getgraphjson')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch graph data')
          }
          return response.json()
        })
        .then(data => {
          const { nodes, links } = data

          // 创建力导向图模拟
          const simulation = d3
            .forceSimulation(nodes)
            .force(
              "link",
              d3
                .forceLink(links)
                .id((d: any) => d.id)
                .distance(100)
            )
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))

          // 创建连线
          const link = svg
            .append("g")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", (d) => Math.sqrt(d.value))

          // 创建节点
          const node = svg
            .append("g")
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("r", 10)
            .attr("fill", (d) => {
              const colors = ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0"]
              return colors[d.group - 1]
            })
            .call(
              d3
                .drag<any, any>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            )

          // 添加节点标签
          const label = svg
            .append("g")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .text((d) => d.id)
            .attr("font-size", 12)
            .attr("dx", 15)
            .attr("dy", 4)

          // 更新力导向图
          simulation.on("tick", () => {
            link
              .attr("x1", (d: any) => d.source.x)
              .attr("y1", (d: any) => d.source.y)
              .attr("x2", (d: any) => d.target.x)
              .attr("y2", (d: any) => d.target.y)

            node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

            label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
          })

          // 拖拽函数
          function dragstarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x
            d.fy = d.y
          }

          function dragged(event: any, d: any) {
            d.fx = event.x
            d.fy = event.y
          }

          function dragended(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
          }

          // 清理函数
          return () => {
            simulation.stop()
          }
        })
        .catch(error => {
          console.error('Error fetching graph data:', error)
          alert('Failed to load graph data. Please try again later.')
        })
    }
  }

  useEffect(() => {
    if (!svgRef.current) return

    // 清除现有的 SVG 内容
    d3.select(svgRef.current).selectAll("*").remove()

    // 设置 SVG 尺寸
    const width = 800
    const height = 600

    // 创建 SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(0,0)")

    // 通过 API 获取动态数据
    fetch('/api/getgraphjson')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch graph data')
        }
        return response.json()
      })
      .then(data => {
        const { nodes, links } = data

        // 创建力导向图模拟
        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3
              .forceLink(links)
              .id((d: any) => d.id)
              .distance(100)
          )
          .force("charge", d3.forceManyBody().strength(-300))
          .force("center", d3.forceCenter(width / 2, height / 2))

        // 创建连线
        const link = svg
          .append("g")
          .selectAll("line")
          .data(links)
          .enter()
          .append("line")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", (d) => Math.sqrt(d.value))

        // 创建节点
        const node = svg
          .append("g")
          .selectAll("circle")
          .data(nodes)
          .enter()
          .append("circle")
          .attr("r", 10)
          .attr("fill", (d) => {
            const colors = ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0"]
            return colors[d.group - 1]
          })
          .call(
            d3
              .drag<any, any>()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          )

        // 添加节点标签
        const label = svg
          .append("g")
          .selectAll("text")
          .data(nodes)
          .enter()
          .append("text")
          .text((d) => d.id)
          .attr("font-size", 12)
          .attr("dx", 15)
          .attr("dy", 4)

        // 更新力导向图
        simulation.on("tick", () => {
          link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y)

          node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)

          label.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y)
        })

        // 拖拽函数
        function dragstarted(event: any, d: any) {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        }

        function dragged(event: any, d: any) {
          d.fx = event.x
          d.fy = event.y
        }

        function dragended(event: any, d: any) {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }

        // 清理函数
        return () => {
          simulation.stop()
        }
      })
      .catch(error => {
        console.error('Error fetching graph data:', error)
        alert('Failed to load graph data. Please try again later.')
      })
  }, [])

  return (
    <svg ref={svgRef} className="w-full h-full" />
  )
}
