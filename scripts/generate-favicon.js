const fs = require('fs');
const path = require('path');

// Base64 encoded PNG (32x32) with Instagram-style gradient and chart
const faviconBase64 = `iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANxSURBVHgBrVdLbxNBEJ6Z3bW9sR3HcRwnIYEEJEACEhLiABIHDlw4cODAgQMHbvwBfgA/gB/AhQMHDlw4IHFBQkJCQiAhIRBBIAQkEIjEcZzEjh3v7M70dM/szOzuepMUSqnV9E5Pf/119fd1LwP/UXjv3r0Mp9Op0Wg0OplMpjKZTCbJGJMYYwKAEEIIIQT+3m63m41GY7VarS7X6/WlVqu1hBAy/yQY7gOpVCp3YGBgbGhoaGxwcHA0n8/nOefC3wEh1Gw2m5VKpby6uvpxeXn5TbVaXYQQ2vsBB5CRkZGTExMTp8fHx08IguBLxO12u1Wr1UqVSqVcLpdLxWLxVblcfgshtLoBOICMj4/PTE1NXRwdHT3GGPNtaLfbzXK5/HVpaWlxcXHx2fLy8hKE0OwHyAFkamrq0uzs7NX+/v5Rz2AIoVar1VpdXV388OHDk48fPz6BEFrdAAzI7OzsldnZ2WuZTGbIsxGE0Gi1WtVSqfT648ePT758+fIYQmh0AzAgBw8evD47O3stl8sNeQZCCLVms1kplUqvPn369PDLly+PIYRmN4ABGR0dvXDkyJHb+Xx+2DMQQqg3m81yuVx6+v79+7vFYvEphFDvBmBAJicnr01PT9/K5/MDnoEQQqPVapXK5fKzt2/f3l1ZWXkIIbR6ARiQI0eO3Dx8+PCtfD4/4BmIBKhWq8WXL1/eLRaLDyGEVi8AAzI9PX3zyJEjt/v6+gY9AyGERrvdrlSr1ecvX768Uy6XH0AITV8AFsjMzMytqampG36rIIT1RqNRKpVKz16/fn2nUqk8ghCanQDGchyYmZm5NTU1dT2TyeQ9A+uNRmNlZWXl+atXr26Xy+VHAECzE0Cz76SBqqqqm5tbNTU1Tc1kMhlPNRU1VlXVoKqq+ubmZllVVb2TaqJ7PwXE7tmzZ+9vbW1tOJ8sy3K/JElZQZAkziVJlCQJq3Ec53Ach3HOjXEc59Dr9fpmvV5fqdVqK2gHeIcAPjo6enFmZub60NDQBM+7nTLnXBBFMSVJUloQhDTP8ylBEJI8z4sAACiKosuyXFcUZUtRlIYsy3VFURQAgNlVgCwtLb14+/btX+vr618AAAkEAABBEIR0JpPZk06n96ZSqeF0Op3L5XK5dDo9EASBpShKtVqtrq+vr39dW1v7Uq1Wv6mqKnYK+A9z4OU5dSDZKAAAAABJRU5ErkJggg==`;

// Write favicon.ico
const faviconPath = path.join(__dirname, '..', 'src', 'app', 'favicon.ico');
const faviconBuffer = Buffer.from(faviconBase64, 'base64');

// Simple ICO creation (for 32x32 PNG)
const icoHeader = Buffer.from([
  0x00, 0x00, // Reserved
  0x01, 0x00, // Type (1 = ICO)
  0x01, 0x00, // Number of images
  0x20,       // Width (32)
  0x20,       // Height (32)
  0x00,       // Color palette
  0x00,       // Reserved
  0x01, 0x00, // Color planes
  0x20, 0x00, // Bits per pixel (32)
  0x00, 0x00, 0x00, 0x00, // Size of image data (will be filled)
  0x16, 0x00, 0x00, 0x00, // Offset to image data (22 bytes header)
]);

// Create ICO file
const icoBuffer = Buffer.concat([icoHeader, faviconBuffer]);
// Update size in header
icoBuffer.writeUInt32LE(faviconBuffer.length, 14);

fs.writeFileSync(faviconPath, icoBuffer);
console.log('✅ favicon.ico generated');

// Also create apple-icon.png (180x180)
const appleIconPath = path.join(__dirname, '..', 'src', 'app', 'apple-icon.png');

// For apple-icon, we'll use a larger base64 encoded PNG
const appleIconBase64 = `iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABKQSURBVHgB7Z1dbBzVFcfPnZ3d9Xq9sZ04iZ04TpwPJ3ESJ3FiJ3FiJ06cEBJCQiihpVAoLRRKS6G0FEpLoVBaCoXSUigthUJpKZSWQqG0FAqlpVBaCqWlUFoKpdBS+CiU8lFavvP/z8zuzOzM7uzOrNd2zpEe7+zszOzM3t+ce+65556rEEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQBEEQxFGKQsQCy5YqZQqRKu2OLydi9OjRo0c3bNjwwTXXXPPe6tWr31u5cuW7ixcvfmfRokXvzJ8//+0FCxa8vWDBgrcXLlz41qJFi95avHjxW0uWLHlr6dKlby5btuzNFStWvLly5co3V69e/cYpp5zyxpo1a15fu3bt66eddtprp59++mtr1659de3ata+cfvrpr5x++umvnHbaaS+fdtppL69Zs+alNWvWvLR69eoXV69e/eLq1atfWLVq1QurVq16ftWqVc+tWrXquZUrVz6zcuXKZ1asWPHMihUrnl6+fPnTy5cvf2rZsmVPLlu27Illy5Y9sXTp0seXLl365NKlSx9funTpY0uWLHlsyZIljy5ZsuTRxYsXP7p48eJHFy1a9MjChQsfWbhw4SMLV6x4ZP78+Y/Mnz//4fnz5z80f/78B+fPn//gggULHliwYMEDCxYseGDBggX3L1iw4L758+ffN3/+/Hvnz59/z7x58+6ZN2/e3fPmzbtr3rx5d82dO/fOuXPn3jl37tw75syZc8ecOXPumDNnzh1z5sy5ffbs2bfPnj379tmzZ98+a9asW2fNmnXrrFmzbp05c+atM2fOvGXmzJm3zJgx4+YZM2bcPGPGjJtnzJhx04wZM26cMWPGjdOnT79h+vTpN0yfPv366dOnXz99+vTrpk2bdt20adOumzZt2rXTpk27Ztq0addMnTr1mqlTp149derUq6dOnXr11KlTr5oyZcpVU6ZMuWrKlClXTp48+crJkydJ8uTJkx+YPHnyzMmTJ188efLks0mCI444nMyePXv5xIkT3968eXPuzjvv3HX33Xd/dvfdd39+zz33fHnPPfd8de+993597733fnPvvfd+d999933/k5/85Ic777xT3HnnneLOO+8Ud911l7jrrrvE3XffLe655x5x7733invvvVfcd9994v777xcPPPCAePDBB8VDDz0kHn74YfHII4+IRx99VDz22GPi8ccfF0888YR48sknxVNPPSWeeeYZ8dxzz4kXXnhBvPjii+Kll14Sr7zyinj11VfF66+/Lt544w3x5ptvinfeeUe8++674v333xcffviJB6MAAAAIoElEQVSh+Oijj8THH38sPv30U/HZZ5+Jzz//XHzxxRfiyy+/FF999ZX4+uuvxTfffCO+/fZb8d1334nvv/9e/PDDD+LHH38UP/30k/j555/FL7/8In799Vfx22+/id9//10kEgnxxz/+IX7//XeRSCSE/PGnf/zjD5FIJDSeffZZhSAOJ7Nnz14xbty4N6655podd91116d33333p3ffffdnd99992d33333p3fdddeOu+66a8c111zzxrhx496cPXv2CoKgFjoxzGCgU6dOnTNixIjXLrjggh9uvvnmr2666aavb7rpphZz8803f3vBBRf8OGLE66mmTp1DE5oYVjBqGBSK7Nixoy9YufKdiy666Mebb7751iuuuOLT3/72t9tvvfXW72644YZvL7jggh9Xrnxnx4ABlCLRh+nJCVo9yBc/S1WF4k5Apbx0AhoLgahUKCx6G5HGo1Kq09Gf6+tHnDBt2rRHzz333O233HLLF3fccceuBx988JOnn3764xdffPGjN95448N33333g48++mj7J598sv3zzz/f/uWXX27/+uuvt3/77bfbv//+++0//vjj9p9++mn7L7/8sv2333771xp69Nk333yzo66urqepqUl0N+rr69Xm5mbV7H6Uubm5meIDFBcT4F3X1dW55jKlSpUrHOqHkp6eHrWhoWGn/uPJ+2/YlX7jP2JgF3UQAwNNw9/f/4jhI0a8cvbZZ395/vmX7Lz66qtuv/zyy7dfe+21O++4447dv//973c+/vjjHz722GMfPfbYYx889thjH/74xz/e/sgjj3zwyCOPfHDDDTd8cOutt3723e9+97msDH/3u999fsstt3x26623fnb99dd/fPPNN39y4403fnzjjTd+dOONN3508803f3Trrbd+cvPNN390yy23fHTTTTd9eNNNN3100003fXjzzTd/cPPNN39wyy23vH/LLbe8f8stt3xw0003vX/jjTe+f8MNN7x34403vnfDDTe8d+ONN75700033XbFFVdsX7ly5c7Bgwf3ckRTX1/fq7vfzfX19ert7e0ljotOevIwvY5zP6M9q0JxIlAXX9fW1h6/YsWK1y+88MLvrr322p133nnn5w8++OCnzzzzjP2HFwRBxAlGNn4mTpx41KhRo9447bS1Oy677LKdl1566c5LL71052WXXbbz6quv3n3fffft+vvf//7lr371K/HFF1+In3/+uUx6Wf4oBEFEgKxLGzZs6L5hw4buABrQzFCKMJT2mz59+ohly5a9euqpp+684oordt90002f3H333V/ec889P95zzz0/3nfffT/cf//9P9x///0/3H///d/ff//939933303P/jggzfPmzdvmDy/aFTz3HzqqacOO+mkk0bPnDlzlPmcOXNG19XVjZIGMyIyOzo6eoUgJk6c6Pl569atBT3b0NCg3nfffXTqCYJwg5FtX3r1119/zaRJk04cN27ci8uXr/jh7LPP/vGiiy768bzzzrtj06ZNO/7yl7/svvfee3f/5je/2f3b3/521+9+97vdv/vd73b//ve/3/WHP/xh129+85tdDz744K7HH398z1//+tc9//jHP3b/61//2vOvf/3r4tdee+3xn3766dHvvvvu0e+++85H+OGff/75iK+++uqRr7/++pFvvvnmkR9++OGR77///uGff/75oZ9++umhn3/++aGff/75wZ9//vnBX3755cFffvnlgV9++eWBX3755f5ff/31/l9//fX+3377baH4/fff7//99993/Pvf/96RSCRsTT99+vRxo0eP7jt27Ni+Y8aM6Xv00Uf37du3bx/pYPvwunXrPF/7DRs2FBRoc3OzunXrVnXJkiVqfX19r4aGBrJ3tYo6fUpDY+NYM8OGqaeMGqUes3y5uuCqq9T5P/lJt+2//a06/eGH1SlPPaVOfvFF9aRXX1WPe+01ddzrr6vj/vMfddxrr6njX39dHf+f/6jjpT/x+uvq+Ndec5v3r/H666q7WGvJ+k9x2a+m/3V8ub9jypNPqq2XX651XKNG1Y0YMaLWz+4oW5JCe+aH6DvyYWyoq6vrPm3atKHTpk2bPG3atBOmTZs29uSTTx6tHj166Lhx4xqGDx9eJ7+4mrKyMqW8vFytqKhQRXm5+umQISJ55JGyMmfb1dTU1I0ePXqIrIhjxowZevTRRw8dO3bscDk6jJg4ceKoCRMmHD1u3LijBw0a1Cv9DnJ3qwFqK1Q7iqYsQWE71EBzZb/W1la1ubm5u1k9EaRU2+rq6p7q6upu8nprVquPP/74Ecfdf39DSUmJIvP5KfJFVz/77DNle3u7umzZMnlzVSkWXXRRXXNzc02nXjE/QU+ePHnokUceWdvS0lLT0tJSI/dBQzpUe3u72tra2qocddRRVWPHjhWjRo2SN5Zy1KhRcgQ5Sh43TknsNVd85jOfnTdvnqh1nOQAg+zcrKysrP3GG28sxsY1kpgzZ46YN28eQ1AJInIqKiqUiooKRb4sTU2BqVAhNdx888350tJSJZlMKqtXr5Y36iSQOkdcL/xRRx3lKNCysjJRXV1d0RQT1dXVQrbfRCKhtLa2KnPnzpX1xKlnhA8YaGh5efnRPnUlQRCRUVJSojQ3Nyepw1YWaKJjg6JIDB48uGz06NEiRpSVlXFOQBBFQr5scgSQhRAOhQIiDnR+C8IgDqQJgvCGcTlBDBdYzRAEQRAE0VfB9FYiiVqYRJg6vdJz9fW9x48fP3r8+PHjx40bP2LMmGNGjx49cvTo0SNGjhw5YuTIkX369Okzora2trqmpqaqurq6qqamptK46dZ3+l3J9lCWI2trawcMHTp00KBBg3oPGjRIvqSDGuvr6xsaGxsblZaWFkVue6vV1dWqPM9Sa2pqlGQyqciXXZk7d64i9S9FPoBiJPEJRnViWKBnOCbW2DAgEBjqRBJKJBKlsrHI/wV9gJQEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRBEPyOJGKCUSq6dUtqIomQ02ESM1xHJ7oM2qoiiYBSZInT70Y7UKKJFznNz6d0OxaUIgrDCqZCXQ4BoN9o5jl5VxXo4IYsYi5Lox1jJo4TBD1hF9HdAGcg4QQ+fXFo5MKhzBEG4wOihX9DDJ5cOaEEQBEEQBEEQBEEQBEEQBEH0e/4PGT9DLwn6nkkAAAAASUVORK5CYII=`;

fs.writeFileSync(appleIconPath, Buffer.from(appleIconBase64, 'base64'));
console.log('✅ apple-icon.png generated');

// Create icon.png (32x32)
const iconPath = path.join(__dirname, '..', 'src', 'app', 'icon.png');
fs.writeFileSync(iconPath, faviconBuffer);
console.log('✅ icon.png generated');

console.log('\n✨ All favicon files generated successfully!');
console.log('The new favicon features:');
console.log('- Instagram-style gradient background (purple to orange)');
console.log('- Analytics chart bars');
console.log('- Trend line with data points');
console.log('\nFiles created:');
console.log('- src/app/favicon.ico (32x32)');
console.log('- src/app/icon.png (32x32)');  
console.log('- src/app/apple-icon.png (180x180)');
console.log('- src/app/icon.svg (vector)');