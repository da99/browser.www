
require "ecr"

class SPECS

  getter files : Array(String) = Dir.glob("src/*.jspp")

  def modules
    files.map { |f| mod_name(f) }
  end

  def mod_name(file_name : String)
    File.basename(file_name, ".jspp").upcase
  end # === def mod_name

  def spec_funcs
    arr = [] of String
    files.each do |file|
      File.read(file).split("\n").each { |raw|
        s = raw.strip
        next unless s =~ /^(void|function)\ *([a-zA-Z0-9\_]+_specs)\(\ *\)\ *\{\ */
        arr << "#{mod_name file}.#{$2}"
      }
    end
    arr
  end # === def spec_funcs

end # === class SPECS

class NODE_SPECS < SPECS
  ECR.def_to_s "specs/node.ecr"

  def initialize
    @files = Dir.glob("src/*.jspp").reject { |s|
      s =~ /\/(browser|DOM).jspp/
    }
  end # === def initialize
end # === class NODE_SPECS

class BROWSER_SPECS < SPECS
  ECR.def_to_s "specs/browser.ecr"
end # === class BROWSER_SPECS

case ARGV.first?
when "write_specs"
  Dir.mkdir_p("tmp/out")
  File.write("tmp/out/node.jspp", NODE_SPECS.new.to_s)
  File.write("tmp/out/browser.jspp", BROWSER_SPECS.new.to_s)
else
  STDERR.puts "!!! Invalid arguments: #{ARGV.inspect}"
  Process.exit(2)
end # === case ARGV.first?
