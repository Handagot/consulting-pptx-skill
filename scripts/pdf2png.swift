// PDF を 1 ページずつ PNG にする（Mac。PowerPoint で書き出した PDF を目で見るため — slide-rules §8.7）
//   swift scripts/pdf2png.swift out.pdf pngdir 1600      → pngdir/p1.png, p2.png, …（幅 1600px）
import AppKit
import PDFKit

let args = CommandLine.arguments
guard args.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
  print("usage: swift pdf2png.swift in.pdf outdir [width]")
  exit(1)
}
let width = CGFloat(Double(args.count > 3 ? args[3] : "1600") ?? 1600)
try? FileManager.default.createDirectory(atPath: args[2], withIntermediateDirectories: true)
for i in 0..<doc.pageCount {
  let page = doc.page(at: i)!
  let r = page.bounds(for: .mediaBox)
  let scale = width / r.width
  let w = Int(r.width * scale), h = Int(r.height * scale)
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8,
                             samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                             colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
  let ctx = NSGraphicsContext(bitmapImageRep: rep)!
  NSGraphicsContext.current = ctx
  ctx.cgContext.setFillColor(NSColor.white.cgColor)
  ctx.cgContext.fill(CGRect(x: 0, y: 0, width: w, height: h))
  ctx.cgContext.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: ctx.cgContext)
  ctx.flushGraphics()
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "\(args[2])/p\(i + 1).png"))
}
print("pages", doc.pageCount)
